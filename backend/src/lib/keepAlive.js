// Free Render instances sleep after ~15 minutes without inbound traffic, and the
// next visitor waits 30-60 s for a cold start. Pinging our own *public* URL goes
// out through Render's proxy and back in, so it counts as traffic and keeps the
// instance awake. (Render sets RENDER_EXTERNAL_URL on every web service.)
//
// On by default when deployed on Render in production; KEEP_ALIVE=false turns it
// off, KEEP_ALIVE_URL points it somewhere else, KEEP_ALIVE_MINUTES changes the interval.
// /api/health doesn't touch the database, so Neon can still scale to zero.
export const startKeepAlive = () => {
  const base = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL;
  const enabled = process.env.KEEP_ALIVE ? process.env.KEEP_ALIVE !== "false" : process.env.NODE_ENV === "production";
  if (!base || !enabled) return null;

  const minutes = Math.min(Math.max(Number(process.env.KEEP_ALIVE_MINUTES) || 10, 1), 14);
  const url = `${base.replace(/\/$/, "")}/api/health`;
  const ping = () =>
    fetch(url, { signal: AbortSignal.timeout(15000), headers: { "User-Agent": "ScorePulse keep-alive" } })
      .then((res) => {
        if (!res.ok) console.warn(`Keep-alive ping returned ${res.status}`);
      })
      .catch((err) => console.warn("Keep-alive ping failed:", err.message));

  console.log(`Keep-alive: pinging ${url} every ${minutes} min`);
  const timer = setInterval(ping, minutes * 60 * 1000);
  timer.unref(); // never holds the process open during shutdown
  return timer;
};
