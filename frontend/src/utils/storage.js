const KEYS = { favorites: "mv_favorites", searches: "mv_recent_searches", recommendations: "mv_recent_recommendations" };

function read(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event("mv-storage")); }

function currentUserScope() {
  const token = localStorage.getItem("mv_token") || sessionStorage.getItem("mv_token");
  if (!token) return "guest";

  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const user = JSON.parse(atob(paddedPayload));
    return String(user.id || user.sub || "guest");
  } catch {
    return "guest";
  }
}

function userKey(key) { return `${key}_${currentUserScope()}`; }

export function getFavorites() { return read(userKey(KEYS.favorites)); }
export function toggleFavorite(movie) {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.movieId === movie.movieId);
  write(userKey(KEYS.favorites), exists ? favorites.filter((item) => item.movieId !== movie.movieId) : [{ ...movie, savedAt: Date.now() }, ...favorites]);
  return !exists;
}
export function addActivity(kind, item) {
  const key = userKey(kind === "search" ? KEYS.searches : KEYS.recommendations);
  const current = read(key).filter((entry) => entry.label !== item.label);
  write(key, [{ ...item, createdAt: Date.now() }, ...current].slice(0, 10));
}
export function getActivity(kind) { return read(userKey(kind === "search" ? KEYS.searches : KEYS.recommendations)); }
export function removeActivity(kind, label) {
  const key = userKey(kind === "search" ? KEYS.searches : KEYS.recommendations);
  write(key, getActivity(kind).filter((entry) => entry.label !== label));
}
export function clearActivity(kind) { write(userKey(kind === "search" ? KEYS.searches : KEYS.recommendations), []); }

export function getUserSettings(email) { return read(`mv_profile_${email}`)[0] || {}; }
export function saveUserSettings(email, settings) { write(`mv_profile_${email}`, [settings]); }
