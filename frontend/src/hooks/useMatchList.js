import { useCallback, useEffect, useState } from "react";
import { apiGet, streamUrl } from "../api";

/**
 * Match cards for a list page. Re-fetches (debounced) whenever the server
 * reports that any match changed.
 */
export const useMatchList = (path) => {
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(
    () =>
      apiGet(path)
        .then((d) => {
          setMatches(Array.isArray(d) ? d : d.matches);
          setError(null);
        })
        .catch((e) => {
          setError(e);
          setMatches((m) => m ?? []);
        }),
    [path]
  );

  useEffect(() => {
    load();
    let timer = null;
    const es = "EventSource" in window ? new EventSource(streamUrl("/matches/stream")) : null;
    es?.addEventListener("match", () => {
      clearTimeout(timer);
      timer = setTimeout(load, 800);
    });
    const poll = setInterval(() => {
      if (!es || es.readyState !== EventSource.OPEN) load();
    }, 30000);
    return () => {
      es?.close();
      clearTimeout(timer);
      clearInterval(poll);
    };
  }, [load]);

  return { matches, error, reload: load };
};
