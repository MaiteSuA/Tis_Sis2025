// ===============================================
// src/api/inscritos.js
// API: Módulo para manejo de inscritos (importación y estadísticas)
// ===============================================

// URL base del backend (usa variable de entorno o fallback local)
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export async function importInscritosCsv(file) {
  // Prepara el archivo en un FormData (multipart/form-data)
  const fd = new FormData();
  fd.append("file", file);

  // Realiza la solicitud POST al endpoint /inscritos/import
  const res = await fetch(`${API_URL}/inscritos/import`, {
    method: "POST",
    body: fd,
  });

  // Si el backend devuelve error, lanza excepción con el texto devuelto
  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  return res.json();
}

export async function getDashboardStats() {
  // Solicitud GET al endpoint /inscritos/stats
  const res = await fetch(`${API_URL}/inscritos/stats`);
  if (!res.ok) throw new Error("No se pudieron cargar stats");
  // Devuelve la respuesta del backend como JSON
  return res.json();
}
