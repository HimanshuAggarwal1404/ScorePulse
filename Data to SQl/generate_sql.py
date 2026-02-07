import pandas as pd
import re

CSV_PATH = "Fielding_test.csv"
OUTPUT_SQL = "output.sql"

PLAYERS_TABLE = "players_stats"
STATS_TABLE = "fielding_test"


def clean_player_name(name):
    # Remove anything inside brackets
    name = re.sub(r"\s*\(.*?\)", "", str(name))
    return name.strip()


def escape_sql_string(s):
    return s.replace("'", "''")


def sql_val(v):
    if pd.isna(v) or v in ["", "-", "—"]:
        return "NULL"
    return str(v)


df = pd.read_csv(CSV_PATH)

sql_lines = []

for _, row in df.iterrows():
    raw_name = row["Player"]
    player = escape_sql_string(clean_player_name(raw_name))

    # 1️⃣ Ensure player exists
    sql_lines.append(f"""
INSERT INTO {PLAYERS_TABLE} (name, nationality, franchise)
SELECT '{player}', NULL, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM {PLAYERS_TABLE} WHERE name = '{player}'
);
""".strip())

    # 2️⃣ Insert fielding stats (STRICT mapping)
    sql_lines.append(f"""
INSERT INTO {STATS_TABLE} (
    player_id,
    span,
    matches,
    innings,
    dismissals,
    catches,
    stumpings,
    catches_as_keeper,
    catches_as_fielder,
    dismissals_per_innings
)
SELECT
    id,
    {sql_val(row['Span'])},
    {sql_val(row['Mat'])},
    {sql_val(row['Inns'])},
    {sql_val(row['Dis'])},
    {sql_val(row['Ct'])},
    {sql_val(row['St'])},
    {sql_val(row['Ct Wk'])},
    {sql_val(row['Ct Fi'])},
    {sql_val(row['D/I'])}
FROM {PLAYERS_TABLE}
WHERE name = '{player}';
""".strip())

with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
    f.write("\n\n".join(sql_lines))

print("✅ Fielding SQL generated → output.sql")
