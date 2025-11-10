// src/services/api.js
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
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("No se pudieron cargar stats");
  return res.json(); // { ok, data: { total, clasificados } }
}
