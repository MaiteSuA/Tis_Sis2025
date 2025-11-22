const BASE = import.meta.env.VITE_API_URL;

// GET todas las áreas
export async function fetchAreas() {
  const r = await fetch(`${BASE}/areas`);
  const j = await r.json();
  return j.data;
}

// Crear área
export async function createArea(nombre) {
  const r = await fetch(`${BASE}/areas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre_area: nombre })
  });
  return r.json();
}

// Actualizar área
export async function updateArea(id, nombre) {
  const r = await fetch(`${BASE}/areas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre_area: nombre })
  });
  return r.json();
}

// Eliminar área
export async function deleteArea(id) {
  const r = await fetch(`${BASE}/areas/${id}`, {
    method: "DELETE",
  });
  return r.json();
}
