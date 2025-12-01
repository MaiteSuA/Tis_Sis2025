// src/api/anuncios.js

// Más adelante puedes cambiar esto a tu helper real de API.
// Por ahora uso fetch directo a tu backend.
const BASE_URL = "http://localhost:3000/api"; // ajusta si tu back usa otro prefijo

// Obtener anuncios activos para el carrusel (vista pública y dashboard)
export async function getAnunciosCarrusel() {
  try {
    const res = await fetch(`${BASE_URL}/anuncios/carrusel`);
    if (!res.ok) {
      console.error("Error HTTP en getAnunciosCarrusel:", res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Error de red en getAnunciosCarrusel:", e);
    return [];
  }
}

// Crear nuevo anuncio desde el dashboard de responsable
export async function crearAnuncioCarrusel(payload) {
  const res = await fetch(`${BASE_URL}/anuncios/carrusel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // si más adelante agregas auth, aquí iría el Authorization: Bearer token
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Error HTTP al crear anuncio:", res.status, text);
    throw new Error("Error al crear anuncio");
  }

  return res.json().catch(() => ({}));
}
