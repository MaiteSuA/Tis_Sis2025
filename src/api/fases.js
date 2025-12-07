// src/api/fases.js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// 👇 función para armar los headers con token
function getAuthHeaders() {
  const token = localStorage.getItem("token"); // usa la MISMA clave que guardas en login

  return {
    "Content-Type": "application/json",
    // Si tu backend espera Authorization:
    Authorization: token ? `Bearer ${token}` : "",
    // Si en tu backend usas 'x-token' en vez de Authorization, cambia la línea de arriba por:
    // "x-token": token || "",
  };
}

// GET: obtener nota mínima
export async function fetchParametroClasificacion() {
  const res = await fetch(`${BASE}/fases/clasificacion`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al obtener parámetro de clasificación:", res.status, txt);
    throw new Error("Error al obtener parámetro de clasificación");
  }

  return res.json(); // { id_fases, nombre_fase, nota_minima, fase_final }
}

// PUT: actualizar nota mínima
export async function updateParametroClasificacion(nota_minima) {
  const res = await fetch(`${BASE}/fases/clasificacion`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ nota_minima }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Error HTTP al actualizar nota mínima:", res.status, text);
    throw new Error("No se pudo actualizar la nota mínima.");
  }

  return res.json(); // fase actualizada
}

export async function eliminarClasificadosPorNotaMinima(ids) {
  const res = await fetch(`${BASE}/fases/clasificados`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Error al eliminar clasificados:", res.status, text);
    throw new Error("No se pudieron eliminar los clasificados.");
  }

  return res.json();
}
