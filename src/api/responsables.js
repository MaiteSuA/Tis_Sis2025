//lo cree para las tabla de desponsable en admin
const API_BASE = "http://localhost:3000/api";

export async function fetchResponsables() {
  const res = await fetch(`${API_BASE}/responsables`);
  const json = await res.json();
  return json.data; // porque tu backend responde { ok:true, data:[...] }
}

export async function createResponsable(payload) {
  const res = await fetch(`${API_BASE}/responsables`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.data;
}

export async function updateResponsable(id, payload) {
  const res = await fetch(`${API_BASE}/responsables/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.data;
}

export async function deleteResponsable(id) {
  const res = await fetch(`${API_BASE}/responsables/${id}`, {
    method: "DELETE",
  });
  const json = await res.json();
  return json;
}
