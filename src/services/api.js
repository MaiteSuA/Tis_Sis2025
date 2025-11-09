const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export async function importInscritosCsv(file) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_URL}/inscritos/import`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  return res.json();
}

export async function getDashboardStats() {
  const res = await fetch(`${API_URL}/inscritos/stats`);
  if (!res.ok) throw new Error("No se pudieron cargar stats");
  return res.json();
}
