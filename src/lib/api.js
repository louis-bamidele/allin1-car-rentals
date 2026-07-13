const BASE = import.meta.env.VITE_API_URL || "";

// Called by Admin.jsx to register a logout handler triggered on 401
let _onUnauthorized = null;
export function setUnauthorizedHandler(fn) { _onUnauthorized = fn; }

function handleUnauthorized(message) {
  if (_onUnauthorized) _onUnauthorized();
  throw new Error(message || "Session expired. Please sign in again.");
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) handleUnauthorized(data.message);
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const getCars = () => apiFetch("/api/cars");

export const getAdminCars = (token) =>
  apiFetch("/api/cars?all=1", { headers: { Authorization: `Bearer ${token}` } });

export const toggleAvailability = (id, available, token) =>
  apiFetch(`/api/cars/${id}/toggle`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ available }),
  });
export const getCar = (slug) => apiFetch(`/api/cars/${slug}`);

export const login = (email, password) =>
  apiFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

// Shared helper: fetch with a hard timeout so the form never hangs forever.
// Photos go through Cloudinary on the server — allow 2 minutes.
function fetchWithTimeout(url, opts = {}, ms = 120_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...opts, signal: controller.signal })
    .then((res) => { clearTimeout(timer); return res; })
    .catch((err) => {
      clearTimeout(timer);
      if (err.name === "AbortError")
        throw new Error("The upload timed out. Check your connection and try again.");
      if (err.message === "Failed to fetch" || err instanceof TypeError)
        throw new Error("Could not reach the server. Check your connection and try again.");
      throw err;
    });
}

export const addCar = (formData, token) =>
  fetchWithTimeout(`${BASE}/api/cars`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) handleUnauthorized(data.message);
    if (!res.ok) {
      const err = new Error(data.message || "Failed to add car");
      if (data.fieldErrors) err.fieldErrors = data.fieldErrors;
      throw err;
    }
    return data;
  });

export const updateCar = (id, formData, token) =>
  fetchWithTimeout(`${BASE}/api/cars/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) handleUnauthorized(data.message);
    if (!res.ok) {
      const err = new Error(data.message || "Failed to update car");
      if (data.fieldErrors) err.fieldErrors = data.fieldErrors;
      throw err;
    }
    return data;
  });

export const deleteCar = (id, token) =>
  apiFetch(`/api/cars/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

// ── Categories ──────────────────────────────────────────────────────────────
export const getCategories = () => apiFetch("/api/categories");

export const addCategory = (data, token) =>
  apiFetch("/api/categories", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateCategory = (id, data, token) =>
  apiFetch(`/api/categories/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteCategory = (id, token) =>
  apiFetch(`/api/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
