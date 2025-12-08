// 📂 src/api/coordinador.js

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ===============================
// BACK -> UI..
// ===============================
function mapBackToUICoordinador(r) {
  if (!r) return null;

  const u = r.usuario || {};
  const correo = u.correo ?? r.correo_electronico ?? "";

  return {
    // ID del registro de coordinador
    id: r.id_coordinador ?? r.id,

    // Columna "Usuario" en la tabla (puedes cambiar a carnet si prefieres)
    usuario: correo || u.nombre || r.carnet || "",

    // Nombres / Apellidos
    nombres: u.nombre ?? r.nombre_coordinador ?? "",
    apellidos: u.apellido ?? r.apellidos_coordinador ?? "",

    // Rol mostrado
    rol: u.rol || "COORDINADOR",

    // Área
    area: r?.area?.nombre_area || "General",

    // Correo / Gmail
    correo,
    gmail: correo,
    // correo: u.correo ?? r.correo_electronico ?? "",

    // Otros datos
    carnet: r.carnet || "",
    telefono: u.telefono ?? r.telefono ?? "",

    // Estado para la pastilla "Activo"
    estado: true,
  };
}

// ===============================
// UI -> BACK
// ===============================
function mapUIToBackCoordinador(f) {
  return {
    nombre_coordinador: f.nombres,
    apellidos_coordinador: f.apellidos,
    correo_electronico: f.correo,
    carnet: f.carnet,
    telefono: f.telefono,
    id_area: Number(f.areaId),
  };
}

// ===============================
// API CALLS
// ===============================
export async function fetchCoordinadores() {
  const r = await fetch(`${BASE}/coordinador`);
  const json = await r.json();
  if (!r.ok) {
    console.error("Error backend al listar coordinadores:", json);
    throw new Error(
      json?.error || json?.message || "Error al listar coordinadores"
    );
  }
  return (json.data || []).map(mapBackToUICoordinador);
}

export async function createCoordinador(form) {
  const payload = mapUIToBackCoordinador(form);
  const r = await fetch(`${BASE}/coordinador`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await r.json();
  if (!r.ok) {
    console.error("Error backend al crear coordinador:", json);
    throw new Error(
      json?.error || json?.message || "Error al crear coordinador"
    );
  }
  return mapBackToUICoordinador(json.data);
}

export async function updateCoordinador(id, form) {
  const payload = mapUIToBackCoordinador(form);
  const r = await fetch(`${BASE}/coordinador/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await r.json();
  if (!r.ok) {
    console.error("Error backend al actualizar coordinador:", json);
    throw new Error(
      json?.error || json?.message || "Error al actualizar coordinador"
    );
  }
  return mapBackToUICoordinador(json.data);
}

export async function deleteCoordinador(id) {
  const r = await fetch(`${BASE}/coordinador/${id}`, { method: "DELETE" });
  const json = await r.json().catch(() => ({}));
  if (!r.ok) {
    console.error("Error backend al eliminar coordinador:", json);
    throw new Error(
      json?.error || json?.message || "Error al eliminar coordinador"
    );
  }
  return true;
}
