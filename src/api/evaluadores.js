// URL base de la API donde se hacen las peticiones al backend
const API_BASE = "http://localhost:3000/api";

/* 
-------------------------------------------------------
FUNCIÓN: fetchEvaluadores
Obtiene todos los evaluadores desde el backend.
-------------------------------------------------------
*/
export async function fetchEvaluadores() {
  // Realiza una petición GET al endpoint /evaluadores
  const res = await fetch(`${API_BASE}/evaluadores`);
  // Convierte la respuesta a formato JSON
  const json = await res.json();
  // Devuelve la propiedad "data" del objeto recibido (la lista de evaluadores)
  return json.data; // { ok:true, data:[...] }
}

/* 
-------------------------------------------------------
FUNCIÓN: createEvaluador
Crea un nuevo evaluador en la base de datos.
-------------------------------------------------------
*/
export async function createEvaluador(payload) {
  // Realiza una petición POST al endpoint /evaluadores
  const res = await fetch(`${API_BASE}/evaluadores`, {
    method: "POST",                         // Método HTTP para crear
    headers: { "Content-Type": "application/json" }, // Indica que el cuerpo es JSON
    body: JSON.stringify(payload),         // Convierte el objeto "payload" a texto JSON
  });

  // Convierte la respuesta a JSON
  const json = await res.json();
  // Devuelve la información del evaluador recién creado
  return json.data;
}

/* 
-------------------------------------------------------
FUNCIÓN: updateEvaluador
Actualiza los datos de un evaluador existente por su ID.
-------------------------------------------------------
*/
export async function updateEvaluador(id, payload) {
  // Realiza una petición PUT al endpoint /evaluadores/{id}
  const res = await fetch(`${API_BASE}/evaluadores/${id}`, {
    method: "PUT",                     // Método HTTP para actualizar
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),    // Envia los datos actualizados
  });
  // Convierte la respuesta a JSON
  const json = await res.json();
  // Devuelve los datos actualizados del evaluador
  return json.data;
}

/* 
-------------------------------------------------------
FUNCIÓN: deleteEvaluador
Elimina un evaluador existente por su ID.
-------------------------------------------------------
*/
export async function deleteEvaluador(id) {
  // Realiza una petición DELETE al endpoint /evaluadores/{id}
  const res = await fetch(`${API_BASE}/evaluadores/${id}`, {
    method: "DELETE",                   // Método HTTP para eliminar
  });
  // Convierte la respuesta a JSON
  const json = await res.json();
  // Devuelve la respuesta del servidor
  return json;
}
