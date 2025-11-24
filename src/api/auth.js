// 📂 src/api/auth.js

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

/* =========================
 *  LOGIN
 * =======================*/
export async function loginApi({ correo, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: correo, // backend espera "username"
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Login failed");
  }

  // guarda usuario + token
  localStorage.setItem("token", data.token);
  localStorage.setItem("usuario", JSON.stringify(data.user));

  return data; // { ok, token, user }
}

/* =========================
 *  REGISTRO
 * =======================*/
export async function registerApi({
  nombre,
  apellido,
  correo,
  password,
  telefono,
  fechaNacimiento, // "YYYY-MM-DD"
}) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    throw new Error(data.error || "Error al registrarse");
  }

  return data; // { ok: true, usuario }
}

/* =========================
 *  ENVIAR CÓDIGO RESET
 * =======================*/
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

  return data; // { ok: true }
}

/* =========================
 *  VERIFICAR CÓDIGO RESET
 * =======================*/
export async function verifyResetCodeApi({ correo, code }) {
  const res = await fetch(`${BASE_URL}/password/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, code }),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Código inválido");
  }

  return data; // { ok: true }
}

/* =========================
 *  CAMBIAR CONTRASEÑA
 * =======================*/
export async function resetPasswordApi({ correo, password }) {
  const res = await fetch(`${BASE_URL}/password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Error al cambiar contraseña");
  }

  return data; // { ok: true }
}
