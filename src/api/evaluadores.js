const API_BASE = "http://localhost:3000/api";

export async function fetchEvaluadores() {
  const res = await fetch(`${API_BASE}/evaluadores`);
  const json = await res.json();
  return json.data; // { ok:true, data:[...] }
}

export async function createEvaluador(payload) {
  const res = await fetch(`${API_BASE}/evaluadores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.data;
}

export async function updateEvaluador(id, payload) {
  const res = await fetch(`${API_BASE}/evaluadores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.data;
}

export async function deleteEvaluador(id) {
  const res = await fetch(`${API_BASE}/evaluadores/${id}`, {
    method: "DELETE",
  });
  const json = await res.json();
  return json;
}
