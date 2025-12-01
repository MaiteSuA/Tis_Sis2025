const BASE = import.meta.env.VITE_API_URL; // ej: http://localhost:3000/api

function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function fetchAreas() {
  const r = await fetch(`${BASE}/areas`, {
    headers: getAuthHeaders(),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.message || 'Error al obtener áreas');
  return j.data; // [{ id_area, nombre_area, ... }]
}

export async function createArea(nombre) {
  const r = await fetch(`${BASE}/areas`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ nombre_area: nombre }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.message || 'Error al crear área');
  return j.data; // área creada
}

export async function updateArea(id, nombre) {
  const r = await fetch(`${BASE}/areas/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ nombre_area: nombre }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.message || 'Error al actualizar área');
  return j.data;
}

export async function deleteArea(id) {
  const r = await fetch(`${BASE}/areas/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.message || 'Error al eliminar área');
  return j.data;
}
