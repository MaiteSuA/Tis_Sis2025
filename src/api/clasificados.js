// src/api/clasificados.js
const BASE = import.meta.env.VITE_API_URL + "/clasificados";

export async function fetchClasificados() {
  const res = await fetch(BASE);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "Error al cargar clasificados");
  }

  // json.data => [{ id_clasificado, id_inscrito, id_fase, estado }]
  return json.data;
}
