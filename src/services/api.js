// src/services/api.js
import { getAuthHeaders } from "../api/auth";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Importar SOLO lo filtrado */
export async function importInscritosCsv({
  file,
  area,               // p.ej. "Matemática"
  nivel,              // p.ej. "Primaria"
  selectedCis = [],   // p.ej. ['8112533','7752110'] (opcional)
  onlyValid = true,
  duplicatePolicy = "omit", // "omit" | "update" | "duplicate"
}) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("onlyValid", String(onlyValid));
  fd.append("duplicatePolicy", duplicatePolicy);
  if (area)  fd.append("areaFilter", area);
  if (nivel) fd.append("nivelFilter", nivel);
  if (selectedCis.length) {
    fd.append("selectedCisJson", JSON.stringify(selectedCis));
  }

  const res = await fetch(`${API_URL}/inscritos/import`, {
    method: "POST",
    headers: { ...authHeaders() }, // no pongas Content-Type con FormData
    body: fd,
  });

  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  return res.json(); // { ok, data: { id_import, total, importados, errores } }
}

/** Stats para el dashboard */
export async function getDashboardStats() {
  const res = await fetch(`${API_URL}/inscritos/stats`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Error obteniendo estadísticas");
  }

  // data.data: { totalInscritos, clasificados }
  return data;
}

/* ================= PERFIL COORDINADOR ================= */

export async function getPerfilCoordinador() {
  const res = await fetch(`${API_URL}/coordinador/perfil`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    credentials: "include",
  });

  const json = await res.json();
  if (!res.ok || json.ok === false) {
    throw new Error(json.error || "No se pudo obtener el perfil");
  }

  // successResponse envuelve en { ok, data }
  return json.data ?? json;
}

export async function updatePerfilCoordinador(data) {
  const res = await fetch(`${API_URL}/coordinador/perfil`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const json = await res.json();
  if (!res.ok || json.ok === false) {
    throw new Error(json.error || "No se pudo actualizar el perfil");
  }

  return json.data ?? json;
}

// 🔹 LISTAR INSCRITOS CON FILTROS
export async function getInscritos({
  area,
  nivel,
  estado,
  search,
  soloSinEvaluador,
} = {}) {
  const params = new URLSearchParams();

  if (area) params.append("area", area);
  if (nivel) params.append("nivel", nivel);
  if (estado) params.append("estado", estado);
  if (search) params.append("search", search);
  if (soloSinEvaluador) params.append("soloSinEvaluador", "1");

  const qs = params.toString();
  const url = `${API_URL}/inscritos${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  const json = await res.json();

  if (!res.ok || json.ok === false) {
    throw new Error(json.error || json.message || "Error al cargar inscritos");
  }

  // Esperamos que el backend responda { ok: true, data: [...] }
  return json.data ?? [];
}

// 🔹 ASIGNAR INSCRITOS A UN EVALUADOR
export async function assignInscritosToEvaluador({
  idEvaluador,
  idsInscritos,
}) {
  const res = await fetch(`${API_URL}/inscritos/asignar-evaluador`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      idEvaluador,
      idsInscritos,
    }),
  });

  const json = await res.json();

  if (!res.ok || json.ok === false) {
    throw new Error(json.error || json.message || "Error al asignar inscritos");
  }

  return json; // por si el backend devuelve { ok: true, asignados: n }
}

// 🔹 OBTENER LISTA DE ÁREAS (para combos, filtros, etc.)
export async function getAreas() {
  const res = await fetch(`${API_URL}/areas`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  const json = await res.json();

  if (!res.ok || json.ok === false) {
    throw new Error(json.error || json.message || "Error al cargar áreas");
  }

  // successResponse envuelve en { ok, data }
  return json.data ?? json;
}

/* ============== RESPONSABLES DE ÁREA ============== */

// GET /api/responsables
export async function getResponsablesArea() {
  const res = await fetch(`${API_URL}/responsables`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  const json = await res.json();

  if (!res.ok || json.ok === false) {
    console.error("Error backend al listar responsables:", json);
    throw new Error(
      json.error || json.message || "Error al cargar responsables de área"
    );
  }

  // successResponse(res, data) → { ok: true, data: [...] }
  return json.data ?? [];
}

// POST /api/responsables
export async function createResponsableArea(form) {
  const payload = {
    // lo que espera createResponsable en el backend
    nombres_evaluador: form.nombre,
    apellidos: form.apellidos,
    correo_electronico: form.email,
    id_area: form.id_area,
    password: form.password || "123456",
    telefono: form.telefono, // opcional, si aplicaste el cambio de arriba
  };

  const res = await fetch(`${API_URL}/responsables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok || json.ok === false) {
    console.error("Error backend al crear responsable:", json);
    throw new Error(
      json.error || json.message || "Error al crear responsable de área"
    );
  }

  return json.data ?? json;
}
