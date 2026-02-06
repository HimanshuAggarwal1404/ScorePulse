# ScorePulse 🏏

**ScorePulse** is a full-stack cricket scoring and match analytics platform built with a strong emphasis on **data modelling, system design, and correctness**.

Inspired by platforms like Cricbuzz and ESPNcricinfo, the goal of this project is not UI mimicry, but to model how **real cricket data flows through a production system** — from ball-by-ball events in a relational database to live-updating scorecards and commentary on the frontend.

---

## ✨ Core Features

### 🏟️ Match & Scoring Engine
- Ball-by-ball match simulation
- Multi-innings match support
- Automatic computation of:
  - Runs
  - Wickets
  - Overs (e.g. `5.6`)
- Match lifecycle handling:
  - `upcoming`
  - `live`
  - `completed`
- Match result calculation and display

### 📝 Live Commentary
- Commentary stored at **ball level**
- Over-wise grouping
- Latest deliveries shown first (like Cricbuzz)
- Visual highlights for:
  - **Wickets**
  - **Fours**
  - **Sixes**
- Commentary text designed to feel realistic and contextual

### 📊 Scorecards
- Dynamically derived from ball data (no redundant storage)
- Accurate innings summaries
- Batting team identification
- Supports partial and completed innings

### 🧑‍🤝‍🧑 Teams & Squads
- Fully relational team–player model
- Supports:
  - International teams
  - IPL franchises
- IPL 2026 squads populated using real players
- Players can belong to multiple teams across seasons
- Dedicated Teams page with:
  - Dynamic SQL-backed data
  - Team → Squad navigation

### 🔄 Auto-Refresh
- Match cards auto-refresh during live matches
- Match details page auto-updates:
  - Scorecard
  - Commentary
- Polling-based refresh (simple, predictable, backend-agnostic)

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

## 📌 Potential Extensions
- Player statistics & career summaries
- Auction and transfer history
- Playing XI selection
- WebSocket-based live updates
- Admin-side match simulation tools

---

## 👤 Author

Built and maintained by **Himanshu Aggarwal**.

>ScorePulse is an evolving project intended to grow with additional formats, leagues, and analytics features.
