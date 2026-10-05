import { useState } from "react";

// Runs an async action (usually a scorer API call), tracking busy / error state.
export const useAction = () => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const run = async (fn) => {
    setBusy(true);
    setError(null);
    try {
      return await fn();
    } catch (e) {
      setError(e);
      return null;
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, setError, run };
};
