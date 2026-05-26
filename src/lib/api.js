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

export const addCar = (formData, token) =>
  fetch(`${BASE}/api/cars`, {
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
  fetch(`${BASE}/api/cars/${id}`, {
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
