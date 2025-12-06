// src/api/anuncios.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function handleResponse(res) {
  let json = {};
  try {
    json = await res.json();
  } catch (_) {}

  if (!res.ok || json.ok === false) {
    throw new Error(json.message || "Error en la solicitud");
  }

  return json.data ?? json;
}

//  Lista TODOS los anuncios (para ResponsableAnuncios)
export async function getAnunciosCarrusel() {
  const res = await fetch(`${BASE_URL}/anuncios/carrusel`);
  return handleResponse(res);
}

//  Crea anuncio
export async function crearAnuncioCarrusel(payload) {
  const res = await fetch(`${BASE_URL}/anuncios/carrusel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

//  Para el HOME (solo anuncios vigentes)
export async function getAnunciosVigentes() {
  const res = await fetch(`${BASE_URL}/anuncios/carrusel/vigentes`);
  return handleResponse(res);
}

export async function eliminarAnuncioCarrusel(id) {
  const res = await fetch(`${BASE_URL}/anuncios/carrusel/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
