import app from "./app.js";
import { resumeRunningReplays } from "./scoring/replay.js";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  resumeRunningReplays().catch((err) => console.error("Could not resume replays:", err.message));
});
