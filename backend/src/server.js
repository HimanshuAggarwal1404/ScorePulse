import app from "./app.js";
import db from "./db/index.js";
import { resumeRunningReplays } from "./scoring/replay.js";
import { startKeepAlive } from "./lib/keepAlive.js";

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  resumeRunningReplays().catch((err) => console.error("Could not resume replays:", err.message));
  startKeepAlive();
});

// Hosts send SIGTERM on redeploy / scale-down: stop taking requests, then close the pool.
// Open Server-Sent Event streams never end on their own, so don't wait on them for long.
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down`);
  server.close(() => db.end().finally(() => process.exit(0)));
  server.closeAllConnections?.();
  setTimeout(() => process.exit(0), 5000).unref();
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
