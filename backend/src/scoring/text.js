// Human-readable match situation / result lines (Cricbuzz style).
import { plural } from "./rules.js";

export const tossText = (match, teamName) => {
  if (!match.toss_winner_id) return null;
  const decision = match.toss_decision === "bat" ? "bat" : "bowl";
  return `${teamName(match.toss_winner_id)} opt to ${decision}`;
};

export const resultText = (match, teamName) => {
  switch (match.result_type) {
    case "win": {
      const winner = teamName(match.winner_id);
      if (match.result_method === "Super Over") {
        return `Match tied (${winner} won the Super Over)`;
      }
      let margin = "won";
      if (match.win_margin_type === "runs") {
        margin = `won by ${plural(match.win_margin, "run")}`;
      } else if (match.win_margin_type === "wickets") {
        margin = `won by ${plural(match.win_margin, "wkt")}`;
      } else if (match.win_margin_type === "innings") {
        margin = `won by an innings and ${plural(match.win_margin, "run")}`;
      }
      const method = match.result_method ? ` (${match.result_method} method)` : "";
      return `${winner} ${margin}${method}`;
    }
    case "tie":
      return "Match tied";
    case "draw":
      return "Match drawn";
    case "no_result":
      return "No result";
    case "abandoned":
      return "Match abandoned";
    default:
      return null;
  }
};

// innings: [{ number, battingTeamId, bowlingTeamId, runs, wickets, legalBalls,
//             target, maxBalls, status, isSuperOver }]
const situationText = (match, innings, teamName) => {
  if (!innings.length) return tossText(match, teamName);

  const last = innings[innings.length - 1];
  const inProgress = last.status === "in_progress";

  // ---- limited overs (and every super over) ----
  if (match.innings_per_team === 1 || last.isSuperOver) {
    const prefix = last.isSuperOver ? "Super Over: " : "";

    if (inProgress && last.target) {
      const need = last.target - last.runs;
      if (need <= 0) return null;
      const ballsLeft = last.maxBalls ? last.maxBalls - last.legalBalls : null;
      return ballsLeft != null
        ? `${prefix}${teamName(last.battingTeamId)} need ${plural(need, "run")} in ${plural(ballsLeft, "ball")}`
        : `${prefix}${teamName(last.battingTeamId)} need ${plural(need, "run")}`;
    }

    // first innings (of the match or of the super over) is done, chase not started
    if (!inProgress && !last.target) {
      return `${prefix}${teamName(last.bowlingTeamId)} need ${plural(last.runs + 1, "run")} to win`;
    }

    if (!inProgress && last.target) {
      return last.runs === last.target - 1 ? `${prefix}Scores level` : null;
    }

    return last.isSuperOver ? "Super Over in progress" : tossText(match, teamName);
  }

  // ---- multi-day: lead / trail / chase ----
  const agg = {};
  for (const i of innings) {
    if (i.isSuperOver) continue;
    agg[i.battingTeamId] = (agg[i.battingTeamId] || 0) + i.runs;
  }

  if (inProgress && last.target) {
    const need = last.target - last.runs;
    return need > 0 ? `${teamName(last.battingTeamId)} need ${plural(need, "run")} to win` : null;
  }

  // break before the 4th innings
  if (!inProgress && innings.length === 3) {
    const chasing = last.bowlingTeamId;
    const need = (agg[last.battingTeamId] || 0) - (agg[chasing] || 0) + 1;
    if (need > 0) return `${teamName(chasing)} need ${plural(need, "run")} to win`;
  }

  if (innings.length === 1 && inProgress) return tossText(match, teamName);

  const team = inProgress || innings.length === 1 ? last.battingTeamId : last.bowlingTeamId;
  const other = team === match.team1_id ? match.team2_id : match.team1_id;
  const diff = (agg[team] || 0) - (agg[other] || 0);
  if (diff > 0) return `${teamName(team)} lead by ${plural(diff, "run")}`;
  if (diff < 0) return `${teamName(team)} trail by ${plural(-diff, "run")}`;
  return "Scores level";
};

export const statusText = (match, innings, teamName) => {
  switch (match.status) {
    case "upcoming":
      return "Match yet to begin";
    case "toss":
      return tossText(match, teamName);
    case "completed":
      return match.result_text || resultText(match, teamName);
    case "abandoned":
      return match.status_note || "Match abandoned";
    default: {
      const situation = situationText(match, innings, teamName);
      if (match.status === "innings_break") {
        return situation ? `Innings Break - ${situation}` : "Innings Break";
      }
      if (match.status === "stumps") {
        return `Day ${match.current_day}: Stumps${situation ? ` - ${situation}` : ""}`;
      }
      if (match.status === "delayed") {
        const note = match.status_note || "Play delayed";
        return situation ? `${note} - ${situation}` : note;
      }
      if (match.status_note) {
        return situation ? `${match.status_note} - ${situation}` : match.status_note;
      }
      return situation;
    }
  }
};
