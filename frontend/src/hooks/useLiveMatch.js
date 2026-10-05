import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet, streamUrl } from "../api";

const LIVE = ["toss", "live", "innings_break", "stumps", "delayed"];

/**
 * Match centre data with live updates.
 * Server-Sent Events push the full state after every ball; if the stream
 * drops, the hook falls back to polling until it reconnects.
 */
export const useLiveMatch = (matchId) => {
  // state is tagged with the match it belongs to, so navigating between
  // matches never shows the previous one
  const [entry, setEntry] = useState({ matchId: null, data: null, error: null });
  const [connected, setConnected] = useState(false);
  const statusRef = useRef(null);

  const data = entry.matchId === matchId ? entry.data : null;
  const error = entry.matchId === matchId ? entry.error : null;

  const setData = useCallback((d) => setEntry({ matchId, data: d, error: null }), [matchId]);

  const refresh = useCallback(
    () =>
      apiGet(`/matches/${matchId}`)
        .then((d) => setEntry({ matchId, data: d, error: null }))
        .catch((e) =>
          setEntry((prev) => ({ matchId, data: prev.matchId === matchId ? prev.data : null, error: e }))
        ),
    [matchId]
  );

  useEffect(() => {
    statusRef.current = data?.match?.status ?? null;
  }, [data]);

  useEffect(() => {
    refresh();

    let es = null;
    if ("EventSource" in window) {
      es = new EventSource(streamUrl(`/matches/${matchId}/stream`));
      es.addEventListener("update", (e) => setEntry({ matchId, data: JSON.parse(e.data), error: null }));
      es.onopen = () => setConnected(true);
      es.onerror = () => setConnected(false); // EventSource retries on its own
    }

    const poll = setInterval(() => {
      const offline = !es || es.readyState !== EventSource.OPEN;
      if (offline && LIVE.includes(statusRef.current)) refresh();
    }, 10000);

    return () => {
      es?.close();
      clearInterval(poll);
    };
  }, [matchId, refresh]);

  return { data, setData, error, connected, refresh };
};
