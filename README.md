# ScorePulse 🏏

**ScorePulse** is a full-stack cricket scoring and match analytics platform inspired by products like Cricbuzz and ESPNcricinfo, but built from the ground up with a strong focus on **data modelling, live match simulation, and clean system design**.

The project demonstrates end-to-end ownership of a production-style application — from relational database design and backend APIs to a modern, responsive frontend.

---

## ✨ Key Features

### 🏟️ Match Engine
- Ball-by-ball match simulation (overs, wickets, extras)
- Multi-innings match support
- Automatic score calculation (runs, wickets, overs)
- Match state handling: **upcoming, live, completed**
- Result computation and display

### 📝 Live Commentary
- Cricbuzz-style commentary feed
- Over-wise grouping with latest balls shown first
- Visual highlights for:
  - **Wickets**
  - **Fours**
  - **Sixes**
- Commentary generated and stored per delivery (ball level)

### 📊 Scorecards
- Dynamic scorecards per innings
- Real-time run/wicket aggregation from ball data
- Accurate overs tracking (e.g. `5.6`)
- Batting team identification

### 🧑‍🤝‍🧑 Teams & Squads
- Fully relational team & player system
- Supports:
  - International teams
  - IPL franchises
- IPL 2026 squads populated using real players
- Players can belong to multiple teams historically
- Dedicated **Teams page** with dynamic SQL-backed data
- Clickable teams → detailed squad views

### 🔄 Auto-Refresh
- Match cards auto-refresh during live matches
- Match details page auto-updates commentary and scores
- Polling-based refresh (backend-agnostic, scalable)

---

## 🧠 Technical Highlights

### Database Design (PostgreSQL)
- Normalized relational schema
- Key tables:
  - `teams`
  - `players`
  - `player_teams`
  - `matches`
  - `innings`
  - `balls`
- Strong use of:
  - Foreign keys
  - Enums (match format, wicket types)
  - Sequence-safe inserts
- Designed for **historical data + future seasons**

### Backend (Node.js + Express)
- RESTful API design
- Query-driven logic (SQL as source of truth)
- Separation of concerns:
  - Controllers
  - SQL query files
- Endpoints for:
  - Match lists
  - Scorecards
  - Ball-by-ball commentary
  - Teams and squads

### Frontend (React)
- Modern React with hooks
- Styled-Components for theme-safe UI
- Dark / Light theme support
- Clean component structure:
  - Match cards
  - Match details page
  - Teams & squad pages
- UI patterns inspired by professional sports platforms

---

## 🗂️ Project Structure (High Level)
backend/
├── src/
│ ├── controllers/
│ ├── queries/
│ ├── routes/
│ └── db/
└── server.js

frontend/
├── src/
│ ├── Pages/
│ ├── Components/
│ ├── context/
│ └── styles/

---

## 🧪 Data Integrity & Reliability

- Sequence-safe inserts (no hard-coded IDs)
- Conflict-safe seeding for players & teams
- Referential integrity enforced at DB level
- Designed to handle:
  - Partial innings
  - Completed matches
  - Multi-season expansion

---

## 🚀 Why This Project

ScorePulse was built to explore **real-world system design problems**:
- Modelling live sports data
- Designing schemas that scale across seasons
- Handling constantly updating data on the frontend
- Keeping business logic close to the database

The emphasis is not just on UI, but on **correctness, structure, and extensibility**.

---

## 📌 Possible Extensions
- Player statistics & career records
- Auction / transfer history
- Playing XI selection
- WebSocket-based live updates
- Admin match simulator panel

---

## 🧑‍💻 Author

Built and maintained by **Himanshu Aggarwal**  
A full-stack project showcasing backend-first thinking with a polished frontend.

---

> This project is actively evolving and designed to grow with additional formats, leagues, and analytics features.
