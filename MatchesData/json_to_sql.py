import json
from pathlib import Path
BASE_DIR = Path(__file__).parent
JSON_FILE = BASE_DIR / "1519140.json"
OUT_SQL = BASE_DIR / "output.sql"
def extract_fielders(fielders):
    """
    Safely extract fielder names from Cricsheet JSON.
    Returns a list of strings.
    """
    result = []

    if not fielders:
        return result

    for f in fielders:
        # Case: "JF Smith"
        if isinstance(f, str):
            result.append(esc(f))

        # Case: { "name": "JF Smith" }
        elif isinstance(f, dict):
            name = f.get("name")
            if name:
                result.append(esc(name))

    return result

def esc(s):
    return s.replace("'", "''") if s else None

def last_name(name):
    return name.split()[-1].lower()

# ---------- LOAD ----------
with open(JSON_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

info = data["info"]

# ---------- SOURCE MATCH ID ----------
source_match_id = (
    str(info.get("match_type_number"))
    if info.get("match_type_number") is not None
    else Path(JSON_FILE).stem
)

sql = []

# ---------- MATCH ----------
sql.append(f"""
INSERT INTO matches (
  source_match_id,
  match_type,
  gender,
  team_type,
  venue,
  city,
  match_date,
  season,
  overs,
  winner,
  win_by_runs,
  win_by_wickets,
  method,
  event_name
)
VALUES (
  '{source_match_id}',
  '{info["match_type"]}',
  '{info["gender"]}',
  '{info["team_type"]}',
  '{esc(info["venue"])}',
  '{esc(info.get("city"))}',
  '{info["dates"][0]}',
  '{info["season"]}',
  {info["overs"]},
  '{esc(info["outcome"]["winner"])}',
  {info["outcome"].get("by", {}).get("runs", "NULL")},
  {info["outcome"].get("by", {}).get("wickets", "NULL")},
  '{esc(info["outcome"].get("method"))}',
  '{esc(info["event"]["name"])}'
)
ON CONFLICT (source_match_id) DO NOTHING;
""")

# ---------- MATCH PLAYERS ----------
for team, players in info["players"].items():
    for p in players:
        ln = last_name(p)
        sql.append(f"""
INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  '{esc(team)}',
  '{esc(p)}',
  '{ln}',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || '{ln}'
WHERE m.source_match_id = '{source_match_id}';
""")

# ---------- INNINGS / OVERS / DELIVERIES / WICKETS ----------
innings_no = 1

for inn in data["innings"]:
    team = inn["team"]

    sql.append(f"""
INSERT INTO innings (
  match_id,
  team_id,
  innings_number,
  batting_team
)
SELECT
  m.id,
  t.id,
  {innings_no},
  '{esc(team)}'
FROM matches m
JOIN teams t ON t.name = '{esc(team)}'
WHERE m.source_match_id = '{source_match_id}';
""")

    for over in inn["overs"]:
        sql.append(f"""
INSERT INTO overs (innings_id, over_number)
SELECT i.id, {over["over"]}
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '{source_match_id}'
  AND i.innings_number = {innings_no};
""")

        for ball_no, d in enumerate(over["deliveries"], start=1):
            is_boundary = d["runs"]["batter"] == 4
            is_six = d["runs"]["batter"] == 6

            sql.append(f"""
INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  {ball_no},
  '{esc(d["batter"])}',
  '{esc(d["bowler"])}',
  '{esc(d["non_striker"])}',
  {d["runs"]["batter"]},
  {d["runs"]["extras"]},
  {d["runs"]["total"]},
  {str(is_boundary).lower()},
  {str(is_six).lower()}
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '{source_match_id}'
  AND i.innings_number = {innings_no}
  AND o.over_number = {over["over"]};
""")

            if "wickets" in d:
                for w in d["wickets"]:
                    fielder_names = extract_fielders(w.get("fielders"))

                    if fielder_names:
                      f_array = "ARRAY[" + ",".join(f"'{n}'" for n in fielder_names) + "]"
                    else:
                      f_array = "NULL"


                    sql.append(f"""
INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  '{esc(w["player_out"])}',
  '{esc(w["kind"])}',
  {f_array}
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;
""")

    innings_no += 1

# ---------- WRITE ----------
Path(OUT_SQL).write_text("\n".join(sql), encoding="utf-8")
print(f"✅ SQL generated for match {source_match_id}")
