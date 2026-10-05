// Server-Sent Events hub. Pages subscribe to one match (full live state on
// every ball) or to the match list (lightweight "something changed" pings).
import db from "../db/index.js";
import { buildMatchView, commentaryFeed, loadMatchData } from "./state.js";

const matchClients = new Map(); // matchId -> Set<res>
const listClients = new Set();
const pending = new Map(); // matchId -> timeout (coalesces bursts, e.g. replays)

const send = (res, event, data) => {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
};

const openStream = (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();
  res.write("retry: 3000\n\n");
  const ping = setInterval(() => res.write(": ping\n\n"), 25000);
  req.on("close", () => clearInterval(ping));
};

export const buildLivePayload = async (matchId) => {
  const data = await loadMatchData(db, matchId);
  if (!data) return null;
  const { view, commentary } = buildMatchView(data);
  return { ...view, latestCommentary: commentaryFeed(commentary, { limit: 30 }).items };
};

export const subscribeMatch = async (req, res, matchId) => {
  openStream(req, res);
  if (!matchClients.has(matchId)) matchClients.set(matchId, new Set());
  matchClients.get(matchId).add(res);
  req.on("close", () => {
    matchClients.get(matchId)?.delete(res);
    if (!matchClients.get(matchId)?.size) matchClients.delete(matchId);
  });

  const payload = await buildLivePayload(matchId);
  if (payload) send(res, "update", payload);
};

export const subscribeList = (req, res) => {
  openStream(req, res);
  listClients.add(res);
  req.on("close", () => listClients.delete(res));
};

const flush = async (matchId) => {
  pending.delete(matchId);

  for (const res of listClients) send(res, "match", { matchId });

  const clients = matchClients.get(matchId);
  if (!clients?.size) return;
  try {
    const payload = await buildLivePayload(matchId);
    if (!payload) return;
    for (const res of clients) send(res, "update", payload);
  } catch (err) {
    console.error("SSE publish error:", err.message);
  }
};

// Called by the engine after every committed change.
export const notifyMatch = (matchId) => {
  matchId = Number(matchId);
  if (pending.has(matchId)) return;
  pending.set(matchId, setTimeout(() => flush(matchId), 60));
};
