export async function createUsuaEvaluador(data) {
  
  const url = `${import.meta.env.VITE_API_URL}/usuariosEval`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al registrar evaluador");
  }

  return json;
}
const BASE = import.meta.env.VITE_API_URL + "/usuariosEval";

export async function getUsuaEvaluadores() {
  const res = await fetch(BASE);
  const json = await res.json();
  if (!json.ok) throw new Error("Error cargando evaluadores");
  return json.data;
}


export async function updateUsuaEvaluador(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al actualizar evaluador");
  return json.data;
}

export async function deleteUsuaEvaluador(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al eliminar evaluador");
  return json;
}
