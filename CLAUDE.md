# CLAUDE.md: working context for ScorePulse

Read this first in every session. `README.md` is the full public write-up; `RECOMMENDATIONS.md` is the to-do list (ticked items are done).

## What this is
Full-stack, ball-by-ball cricket scoring platform. A scorer enters each delivery in `/scorer`; the engine applies the Laws inside a DB transaction; every viewer gets live updates over Server-Sent Events. Around that: 624 real players with career records, current squads, live ICC rankings, the real fixture calendar and news.
**USP to protect:** ScorePulse *produces* scores. Never link fixtures or scorecards out to Cricbuzz or Cricinfo. External fixtures link to our own match page if we have it; otherwise they offer "Score this match" (prefills the scorer console).

## Stack and layout
- `backend/`: Node 20+ (local 24), Express 5, ES modules, `pg`, **raw SQL, no ORM**. No backend linter.
  - `src/scoring/`: `engine.js` (all writes, row-locked txns), `rules.js`, `state.js` (derives scorecards / commentary / live panel), `events.js` (SSE hub, 60 ms coalescing), `replay.js`, `cricsheet.js`, `text.js`
  - `src/controllers/`: live (matches), scoring, players, teams, teamPlayers, rankings, fixtures, news
  - `src/lib/`: `cricbuzz.js` (Next.js flight decode, `valueAfter` / `valuesAfter`, `cached()` = TTL + single-flight + stale-on-error), `teamLogos.js`, `keepAlive.js`
  - `scripts/`: `migrate.js`, `import-cricsheet.js`, `test-engine.js`, `verify-scorecards.js`, `players/{fetch,load,sources,teams}.js`
  - `db/migrations/` (001 live scoring, 002 players), `db/seed/players.json` (committed snapshot, ~1.9 MB)
- `frontend/`: React 19, Vite 7, React Router 7, styled-components 6 (+ Sass for `index.scss` theme variables). ESLint 9 with React 19 hooks rules.
  - `src/ui/kit.jsx` (design system), `src/ui/styles.js` (`glass`, `pressable`, `initials`)
  - `src/ui/players.jsx` = **components only** (`PlayerPhoto`, `TeamMono`, `TeamLogo`); `src/ui/playerStats.js` = **helpers only** (team colours, roles, formats, totals, rankings). Keep that split, or lint fails `react-refresh/only-export-components`.
  - `public/logos/ipl/*.png`: self-hosted IPL crests (iplt20.com blocks browser hotlinks with ORB)
- `MatchesData/`: 12 Cricsheet JSON matches (import / replay sources).
- Root: `render.yaml` (Render blueprint), `neon.ts` + root `package.json` (Neon config), `.claude/skills/` (Neon skills).

## Commands
```bash
cd backend && npm run dev            # API on :8000 (nodemon watches src); the user often already has it running
cd backend && npm test               # 37 engine checks + 524 scorecard checks; must stay green
cd backend && npm run db:migrate     # applies new files in db/migrations
cd backend && npm run players:sync   # fetch (web → snapshot, cached in backend/.cache) + load (snapshot → DB)
cd backend && npm run players:load   # snapshot → DB only, offline
cd frontend && npm run dev           # :5173 (the user often already has it running)
cd frontend && npx eslint src && npx vite build
```

## Invariants: don't break these
- **Deliveries are the single source of truth.** Never store totals, overs or figures; derive them in `state.js` or SQL. Generated columns (`runs_total`, `is_legal`) and constraints enforce this.
- **Every match write goes through `engine.js`** (console, importer and replays share it).
- Players are upserted by `cricbuzz_id` / `cricinfo_id` so `/players/:id` URLs stay stable. Scorecards link via `match_players.player_id` (Cricsheet `registry_id` → `players.cricsheet_id`).
- Schema changes = a new numbered migration file. **Also apply it to Neon** (see Deployment).
- Comment style: short "why" comments, matching the surrounding code. No narration comments.

## Deployment (live; free tier; nothing billable)
- **Frontend:** Vercel. Env `VITE_API_URL=https://<render-service>.onrender.com` (no `/api`; marked as non-sensitive "Config"). Vite bakes it in at build time, so change it → redeploy.
- **API:** Render free web service from `render.yaml` (`rootDir: backend`, `npm ci`, `npm start`, health `/api/health`). Auto-deploys on push to `main` when `backend/` changes.
  - Env vars on Render: `DATABASE_URL` (Neon *pooled* URL, no quotes), `SCORER_KEY`, `CORS_ORIGIN` (Vercel domain, comma list, `*` wildcard for previews), `NODE_ENV=production`, `NODE_VERSION=22`.
  - **Built-in keep-alive** pings `RENDER_EXTERNAL_URL/api/health` every 10 min (prod only; `KEEP_ALIVE=false` disables). `/api/health` doesn't touch the DB.
- **DB:** Neon project `frosty-sun-96808696` (org `org-bold-bonus-80895710`), branch `production`, database `scorepulse`, Postgres 18.6 (same as local). Repo linked via `neon link`; `.neon` and `.env.local` (holds `DATABASE_URL`, `DATABASE_URL_UNPOOLED`) are git-ignored. **Never print their values.**
  - Run something against Neon: `set -a; . ./.env.local; set +a` from the repo root, then e.g. `cd backend && npm run db:migrate` or `npm run players:load` (the backend prefers `DATABASE_URL` over `DB_*`).
  - Local dev uses local Postgres via `backend/.env` (`DB_*`); `.env.local` is not read by the backend unless sourced.
  - Initial copy was done with `pg_dump --no-owner --no-privileges` → `psql $DATABASE_URL_UNPOOLED --single-transaction`. All 18 tables' row counts matched.
- Security in place: helmet, CORS allowlist, tiered rate limits (`/api` 900 per 5 min, `/api/scoring` 300, third-party-backed endpoints 120), 100 KB JSON cap, timing-safe `x-scorer-key`, scoring **locked in prod if `SCORER_KEY` unset**, TLS (`sslmode` normalised to `verify-full`), graceful SIGTERM, gzip (SSE excluded). Prod deps: 0 audit vulns.

## External data (fragile by nature)
- Cricbuzz pages = Next.js; data lives in `self.__next_f.push` chunks. Pages repeat JSON blocks (header ticker vs main list), so **use `valuesAfter` and dedupe**. Results groups are anchored on `"matchType":"X","seriesMatches":`.
- Caches: news 10 min (ESPNcricinfo RSS), fixtures results 2 min / upcoming 30 min, rankings 6 h. All in-memory, single process.
- Player sync: Cricbuzz squads + profiles; Statsguru for Cricinfo ids (scored matcher: name, country incl. "AUS/ENG", per-format match counts, apostrophes) and fielding; Cricsheet `people.csv` for scorecard links. 13 of 495 players have no Cricinfo match (no fielding); that's accepted.
- Team ↔ Cricbuzz id map: `scripts/players/teams.js`; flag image ids: `src/lib/teamLogos.js`.

## Gotchas learned the hard way
- Bash heredocs passed through the tool can mangle backslashes in Python / JS code. Write scripts with the Write tool, or avoid regex backslashes in heredocs; `sed` in-place edits have clobbered lines before.
- `FORCE_COLOR` is set: `node -e "console.log(n)"` wraps numbers in ANSI codes. Use `process.stdout.write(String(n))` when capturing values.
- Git Bash `/tmp` ≠ Node's `/tmp`. Use `$TEMP` or relative paths when handing files between curl and node.
- The browser QA intro animation plays once per session: set `sessionStorage.introPlayed="true"` first. Scorer key in the browser = `localStorage.scorerKey`. Use the `browser-automation` skill to screenshot and verify UI.
- Stop test servers on Windows with `powershell Get-NetTCPConnection -LocalPort N ... | Stop-Process`. Don't kill the user's own :8000 / :5173 servers.
- React 19 lint forbids setState directly in effects: reset per-route state by keying a child component on the id (see `PlayerProfile`, `TeamDetails`).
- `teams` / `venues` / `tournaments` have no base migration (they predate migrations), so a fresh DB needs a `pg_dump` of an existing one.

## Working with the user (Himanshu)
- Building this as a **portfolio / resume project**; the live link matters. **Free tiers only.**
- For bigger product or design choices, **offer options with AskUserQuestion** (with previews) and let them pick; e.g. news layout and fixtures approach were chosen that way.
- Verify visually (screenshots) and run `npm test` + lint + build before reporting done. Don't commit unless asked; they commit and push themselves.
- `resume.md` (git-ignored) holds measured metrics and STAR stories for their resume. Update its numbers if a feature changes them. Never inflate metrics.

## Open work (see RECOMMENDATIONS.md)
Scorer accounts instead of a shared key; base schema migration; real tournaments and points tables (still mock data); CI (GitHub Actions) + Playwright; multi-instance SSE via Postgres LISTEN/NOTIFY; charts (worm / Manhattan); keyboard shortcuts in the scorer; route-level code splitting (bundle > 500 KB); remove unused deps (`@heroui/*`, `tailwindcss`, `swiper`).
