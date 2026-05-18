const BASE = import.meta.env.VITE_API_URL || "";

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add car");
    return data;
  });

export const updateCar = (id, formData, token) =>
  fetch(`${BASE}/api/cars/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update car");
    return data;
  });

export const deleteCar = (id, token) =>
  apiFetch(`/api/cars/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
