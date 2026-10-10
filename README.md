# ScorePulse 🏏

**ScorePulse** is a full-stack cricket scoring and match analytics platform built with a strong emphasis on **data modelling, system design, and correctness**.

Inspired by platforms like Cricbuzz and ESPNcricinfo, the goal of this project is not UI mimicry, but to model how **real cricket data flows through a production system** — from ball-by-ball events in a relational database to live-updating scorecards and commentary on the frontend.

---

## ✨ Core Features

### 🏟️ Match & Scoring Engine
- One engine (`backend/src/scoring/engine.js`) applies the Laws to every ball, whether it comes from the scorer console, a replay or an import
- Legal vs illegal deliveries, wides / no-balls / byes / leg byes / penalty runs, boundaries vs runs run
- Strike rotation, end of over, no consecutive overs, bowling quotas, new batter / bowler prompts
- Innings end on all out, overs, target reached, declaration or forfeit
- Targets for chases and 4th innings, DLS revisions, super overs, follow-on
- Results worked out automatically: by runs, wickets, an innings, ties, draws, no result
- Match lifecycle: `upcoming` → `toss` → `live` ⇄ `innings_break` / `delayed` / `stumps` → `completed` / `abandoned`
- Undo last ball (reopens a finished innings or match)

### 📡 Live Updates
- Server-Sent Events push the full match state after every ball (`/api/matches/:id/stream`)
- Match lists refresh when any match changes (`/api/matches/stream`)
- Falls back to polling if the stream drops

### 📝 Commentary
- Ball-by-ball, newest first, with optional scorer text per ball
- Ball numbers like Cricinfo: extras repeat the number (`4.3`, `4.3`)
- End-of-over summaries (runs, score, batters, bowler figures) and innings breaks
- Wicket lines: `Kohli c Smith b Starc 45(30) [4s-5 6s-1]`

### 📊 Scorecards
- Derived from deliveries on every request; nothing is stored twice
- Batting (dismissal text, R, B, 4s, 6s, SR), extras breakdown, total, did not bat
- Fall of wickets, bowling (O, M, R, W, NB, WD, ECO), partnerships, over-by-over
- Live panel: batters at the crease, current / previous bowler, partnership, last wicket, CRR / RRR, recent balls

### 🎙️ Scorer Console (`/scorer`)
- Create a match, pick playing XIs, record the toss, score ball by ball
- Rain delays, stumps, DLS target revisions, declarations, manual results, player of the match, substitutes
- Replay any real Cricsheet match from `MatchesData/` live, at a chosen speed

### 🧑‍🤝‍🧑 Teams, Squads & Players
- Current squads of 12 international sides and all 10 IPL franchises (real 2026 squads), plus the domestic sides in the imported matches
- 600+ player profiles: photo, role, batting / bowling style, date and place of birth, ICC rankings, debuts, recent form
- Career records for Tests, ODIs, T20Is and the IPL: batting, bowling and fielding
- Every team a player has represented: national side, IPL, other leagues (BBL, PSL, SA20, The Hundred, CPL ...) and domestic sides
- Players page with leaderboards, team / role filters, search and sorting; team pages show the squad grouped by role
- Scorecard names link to profiles (matched through the Cricsheet registry), and profiles list the player's matches on ScorePulse
- The scorer picks each XI by searching the team's squad (or every player), so new matches link to profiles too

### 📅 Fixtures, Rankings & News
- Fixtures page shows the real cricket calendar and recent / live results. Fixtures never link out: ones ScorePulse has scored open our own ball-by-ball page, and the rest offer **Score this match**, which opens the scorer console already filled in
- Live ICC rankings for teams, batters, bowlers and all-rounders in all three formats, linked to team pages and player profiles
- Teams page with flags, IPL crests, current ICC positions and squad faces
- Home page news from ESPNcricinfo

**Where the player data comes from** (`npm run players:sync`):
- [Cricbuzz](https://www.cricbuzz.com): squads, profiles, images, batting & bowling records
- [ESPNcricinfo Statsguru](https://stats.espncricinfo.com): fielding records, and full records for players Cricbuzz doesn't list
- [Cricsheet people register](https://cricsheet.org/register/): ties imported ball-by-ball matches to players

The result is committed as `backend/db/seed/players.json`, so `npm run players:load` builds the player tables without touching the network.

---

## 🧱 Architecture & Tech Stack

ScorePulse is designed as a **backend-first, API-driven application** with a clear separation of concerns.

### Backend
- **Node.js** + **Express**
- **PostgreSQL** as the primary datastore
- Raw **SQL queries** used intentionally for:
  - Precise joins and aggregations
  - Reliable score computation
  - Clear ownership of business logic
- Strong relational design with:
  - Foreign keys
  - Enum constraints
  - Sequence-safe inserts

**Backend responsibilities**
- Match lifecycle management
- Score aggregation from ball data
- Commentary retrieval and ordering
- Team and squad data management

---

### Frontend
- **React** (hooks-based)
- **Styled-Components** for scoped, theme-aware styling
- Light / Dark theme support
- UI patterns inspired by professional sports platforms

**Frontend responsibilities**
- Match listing & live match cards
- Detailed match view (scorecard + commentary)
- Teams & squad exploration
- Clear visual hierarchy for live data

---

## 🧠 Data Model Philosophy

- **Balls are the source of truth**
- Scores, overs, and wickets are always **derived**
- No redundant or denormalized score storage
- Designed to support:
  - Multiple leagues
  - Future seasons
  - Historical match data
- Schema prioritizes correctness over convenience

---

## 🧪 Data Integrity & Reliability

- Strict foreign-key enforcement
- Enum-based domain validation
- Conflict-safe and sequence-safe inserts
- Designed to handle:
  - Partial innings
  - Live matches
  - Completed matches without data loss

---

## 🚀 Why This Project

ScorePulse was built to explore **real system-design problems**, not just UI rendering:
- Modelling live sports data
- Designing schemas that scale across seasons
- Keeping business logic close to the database
- Ensuring frontend state reflects backend truth

The project reflects a **production-oriented mindset**, with emphasis on structure, clarity, and extensibility.

---

## 🛠️ Running locally

```bash
# backend
cd backend
cp .env.example .env          # fill in DB_PASSWORD (and optionally SCORER_KEY)
npm install
npm run db:migrate            # creates the live-scoring tables (skips ones already applied)
npm run import:cricsheet      # imports every match in MatchesData/ through the engine
npm run players:load          # players, squads and career records from db/seed/players.json
npm run dev                   # http://localhost:8000

# frontend
cd frontend
npm install
npm run dev                   # http://localhost:5173  (set VITE_API_URL if the API isn't on :8000)
```

- `npm test` (backend) runs the engine rule checks and cross-checks every imported scorecard against the raw Cricsheet files.
- If `SCORER_KEY` is set, the scorer console asks for it once and keeps it in the browser.

### Live-scoring API

| Method | Endpoint | |
|---|---|---|
| GET | `/api/matches?status=live\|upcoming\|completed` | match cards |
| GET | `/api/matches/recent` | live first, then latest results |
| GET | `/api/matches/:id` | full match state (info, live panel, scorecards, latest commentary) |
| GET | `/api/matches/:id/scorecard` | scorecards only |
| GET | `/api/matches/:id/commentary?innings=&before=&limit=` | paged commentary |
| GET | `/api/matches/:id/stream`, `/api/matches/stream` | Server-Sent Events |
| GET | `/api/fixtures?type=upcoming\|results` | real-world calendar (Cricbuzz), linked to ScorePulse matches where we have them |
| GET | `/api/rankings` | ICC men's team & player rankings (via Cricbuzz, refreshed every 6 h) |
| GET | `/api/news` | cricket headlines (ESPNcricinfo RSS, refreshed every 10 min) |
| * | `/api/scoring/...` | scorer console (see `backend/src/routes/scoring.routes.js`) |

---

## 📌 Potential Extensions
- Auction and transfer history
- Refresh squads and records on a schedule (`npm run players:sync` re-fetches; responses are cached in `backend/.cache`)
- DLS par-score calculation (targets are entered by the scorer today)

---

## 👤 Author

Built and maintained by **Himanshu Aggarwal**.

>ScorePulse is an evolving project intended to grow with additional formats, leagues, and analytics features.
