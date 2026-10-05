# ScorePulse - Recommended Changes

A to-do list of improvements, sorted by priority: work top to bottom.
Each item says **why** it matters and **where** to start.

Legend: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Nice to have

---

## 🔴 1. Make the database reproducible from the repo

- [ ] **Add a base schema migration (`backend/db/migrations/000_base_schema.sql`)**
  - **Why:** `001_live_scoring.sql` depends on `teams`, `players`, `player_teams`, `players_stats`, `batting_*`, `bowling_*`, `fielding_*`, `tournaments`, `points_table` and `venues`. None of these are created anywhere in the repo; they only exist in the local Postgres. A fresh clone cannot run the project.
  - **How:** `pg_dump --schema-only` those tables into `000_base_schema.sql`.
  - **Bootstrap:** on the existing database, mark `000` as applied: `INSERT INTO schema_migrations VALUES ('000_base_schema.sql')`.
- [ ] **Add a seed script** for teams, squads and career stats, so `npm run db:migrate && npm run db:seed && npm run import:cricsheet` builds a working database from nothing.
  - Reuse `Data to SQl/generate_sql.py` / `output.sql`, or convert them to a Node script.

## 🔴 2. Stop using the Postgres superuser

- [ ] **Create a dedicated app role**, for example `scorepulse_app`.
  - **Why:** the app connects as `postgres` (password), which can drop any database on the machine.
  - **How:** grant the role only `SELECT/INSERT/UPDATE/DELETE` on the tables in this database, then put it in `backend/.env`.
  - Keep the superuser for running migrations only.

## 🟠 3. Fix known bugs

- [ ] **`/series/:id` route doesn't exist.** Clicking a series on the Tournaments page lands on the 404 page.
  - **Where:** `frontend/src/Pages/Tournaments.jsx` (`linkFor`) and `frontend/src/App.jsx`.
  - **Fix:** add a series page, or link series to a filtered Fixtures view instead.
- [ ] **The players API depends on the working directory.**
  - **Where:** `backend/src/controllers/players.controller.js`.
  - **Problem:** it loads `path.resolve("src/queries/players.sql")`, which only works when the server is started from `backend/`. Started from the repo root, `/api/players` crashes.
  - **Fix:** resolve the path relative to the file with `fileURLToPath(import.meta.url)`, as `backend/src/scoring/cricsheet.js` does.
- [ ] **`/api/players` returns all 4,976 rows in one response.**
  - **Fix:** add server-side `?search=&limit=&offset=` and make the Players page request pages instead of filtering everything in the browser.
- [ ] **The players SQL file is split with a fragile regex.**
  - **Where:** `getQuery()` in `players.controller.js` cuts `players.sql` apart by comment markers.
  - **Fix:** move each query into its own file, or into constants.

## 🟠 4. Security before deploying anywhere

- [ ] **Real scorer authentication.** Today one shared `SCORER_KEY` is stored in the browser's `localStorage`. Replace it with user accounts and roles (scorer, admin): session or JWT login, and record who scored each ball.
- [ ] **Restrict CORS.** `app.use(cors())` currently allows any website to call the API. Allowlist the frontend's own domain.
- [ ] **Rate limiting** on `/api/scoring/*` (for example `express-rate-limit`).
- [ ] **Security headers** with `helmet`.
- [ ] **Validate request bodies** with a schema library (zod or joi) on the scoring endpoints. The engine already checks the cricket rules, but not the shape of the request.

## 🟠 5. Automated tests and CI

- [ ] **GitHub Actions workflow:**
  - start a Postgres service;
  - run `npm run db:migrate`, `npm run import:cricsheet` and `npm test` in `backend/`;
  - run `npm run lint` and `npm run build` in `frontend/`.
- [ ] **Frontend end-to-end tests (Playwright).** Cover:
  - creating a match in `/scorer` and picking the XIs;
  - the toss, then scoring a run, a four, a wide and a wicket;
  - the public match page updating live.

## 🟡 6. Replace the remaining mock data with real data

- [ ] **Points tables from real matches.**
  - **Why:** `matches.tournament_id` now exists, so standings can be calculated from results instead of the hard-coded `pointsTableData`.
  - **What to calculate:** played, won, lost, tied, no result, points, and net run rate from `innings_totals`.
- [ ] **Tournaments page from the `tournaments` table** instead of the hard-coded `tournamentsData`.
- [ ] **Rankings:** either compute simple rankings, or hide the page until real data exists. `mockRankings` only has a few hard-coded rows.
- [ ] **Home page "Top stories" and "Latest news" are hard-coded.** Either add a small news table and admin form, or remove the sections. Two of the stock image links are already broken.

## 🟡 7. Clean up the data model

- [ ] **Link scorecard players to career stats reliably.**
  - **Why:** only 83 of 268 scorecard players link to a profile, because linking needs an exact name match.
  - **How:** use Cricsheet's people register (`people.csv` maps registry IDs to Cricinfo IDs) and store the ID on `players_stats`.
- [ ] **Merge or link the two player tables.** `players` (squads) and `players_stats` (career records) describe the same people with no connection; add a foreign key, or merge them.
- [ ] **One team code column.** `teams` has both `short_code` and `code` (SAF vs RSA, SLK vs SL, NZL). Keep one and update the queries.
- [ ] **The `match_format` enum is unused.** Drop it, or use it for `matches.format`.

## 🟡 8. Deployment and scaling

- [ ] **Shared live-update channel across servers.**
  - **Why:** the live-update hub (`backend/src/scoring/events.js`) and the replay timers (`replay.js`) live in a single server's memory. With more than one backend instance, viewers on other instances won't get updates.
  - **How:** Postgres `LISTEN/NOTIFY` is the simplest option; Redis pub/sub is the common one.
- [ ] **Choose a host that supports long-lived connections** for Server-Sent Events. Most serverless platforms don't. Also disable proxy buffering: the API already sends `X-Accel-Buffering: no`.
- [ ] **Run replays from one place only.** Make sure only one instance runs them, using a lock or a separate worker process.
- [ ] **Health check:** add a `/api/health` endpoint that also pings the database.
- [ ] **Graceful shutdown:** on `SIGTERM`, close open live streams, stop replay loops, then `pool.end()`.
- [ ] **Structured logging** (for example `pino`) instead of `console.log`.

## 🟡 9. Performance

- [ ] **Smaller frontend download.** The bundle is about 813 KB. Load routes on demand with `React.lazy` + `Suspense`; the scorer pages and the Lottie intro animation are good candidates.
- [ ] **Remove unused dependencies:** `@heroui/react`, `@heroui/styles`, `tailwindcss`, `@tailwindcss/vite` and `swiper` are only referenced by `index.css`, which nothing loads.
- [ ] **Cache the match view.** `buildMatchView` rebuilds the whole match from every delivery on each request. That's fine for T20s, but slower for Tests. Cache the result per match until `matches.updated_at` changes.

## 🟢 10. Repo housekeeping

- [ ] **Remove Vite's cache folder `frontend/.vite/`**, which was committed by mistake, and add `.vite/` to `.gitignore`.
- [ ] **Delete unused files:**
  - `frontend/src/index.css` and `index.css.map` (old compiled CSS; styles live in `index.scss`);
  - `frontend/src/App.css`;
  - `frontend/src/Components/match.txt` (old mock data).
- [ ] **Remove the duplicate CSVs in `Data to SQl/`.** The same files exist both at the top level and inside the `Batting/`, `Bowling/` and `Fielding/` folders.
- [ ] **Move `frontend/src/Skills.md`** to a `docs/` folder; it isn't source code.

## 🟢 11. Scorer console improvements

- [ ] **Keyboard shortcuts** for fast scoring: `0`–`6` for runs, `W` for wicket, `D` for wide, `N` for no-ball, `B` for bye, `L` for leg bye, `U` for undo.
- [ ] **Edit any past ball**, not just undo the last one. This needs the engine to replay the innings from the edited ball.
- [ ] **Offline queue:** keep balls scored without a connection in local storage and send them in order on reconnect.
- [ ] **DLS par score helper**, or at least a field for entering the official par score during rain breaks.

## 🟢 12. Viewer features and accessibility

- [ ] **Screen reader announcements:** mark the commentary feed with `aria-live="polite"` so new balls are read out.
- [ ] **Charts:** a run "worm" (cumulative runs per over for both innings) and a Manhattan (runs per over as bars).
- [ ] **Win probability bar** for chases.
- [ ] **Push / browser notifications** for wickets, milestones and results in followed matches.
- [ ] **Shareable score cards:** an Open Graph image per match, so shared links show the score.
