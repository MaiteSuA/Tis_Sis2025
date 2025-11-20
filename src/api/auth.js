//  src/api/auth.js

export async function loginApi({ correo, password }) {
  const res = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo, password }),
  });

  const data = await res.json();

  // Validaciones
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Login failed");
  }

  // Guardar token y usuario
  localStorage.setItem("token", data.token);
  localStorage.setItem("usuario", JSON.stringify(data.usuario));

  return data;
}
// src/api/auth.js

export async function registerApi({
  nombre,
  apellido,
  correo,
  password,
  telefono,
  fechaNacimiento, // "YYYY-MM-DD"
}) {
  const res = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      apellido,
      correo,
      password,
      telefono,
      fechaNacimiento,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Error al registrarse');
  }

  return data; // { ok: true, usuario }
}
// src/api/auth.js
const BASE_URL = "http://localhost:3000/api";

export async function sendResetCodeApi({ correo }) {
  const res = await fetch(`${BASE_URL}/password/forgot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo }),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Error enviando código");
  }

  return data;
}

