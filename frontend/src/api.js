// Single place for the backend URL. Override with VITE_API_URL in frontend/.env.
export const API_BASE = `${(import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "")}/api`;

const SCORER_KEY = "scorerKey";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const request = async (method, path, body, headers = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  return data;
};

export const apiGet = (path) => request("GET", path);

export const getScorerKey = () => localStorage.getItem(SCORER_KEY) || "";
export const setScorerKey = (key) => localStorage.setItem(SCORER_KEY, key);

// Scorer console calls carry the optional shared key.
export const scorer = (method, path, body) =>
  request(method, `/scoring${path}`, body, { "x-scorer-key": getScorerKey() });

export const streamUrl = (path) => `${API_BASE}${path}`;
