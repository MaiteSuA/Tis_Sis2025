// 📂 src/api/auth.js

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

/* =========================
 *  LOGIN (acepta { username } o { correo })
 * =======================*/
export async function loginApi({ username, correo, password, role }) {
  const userOrCorreo = (username ?? correo ?? "").trim();

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: userOrCorreo, // backend espera "username"
      password,
      role, // si tu backend lo usa en mock
    }),
  });

  const data = await res.json();

  // si el backend no manda "ok", solo revisamos res.ok
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || "Login failed");
  }

  // 👇 Intentamos obtener el usuario de varias propiedades posibles
  const rawUser =
    data.user ??     // caso: { ok, token, user: {...} }
    data.data ??     // caso: { ok, token, data: {...} }
    data.usuario ??  // otros nombres posibles
    data.userData ??
    {};

  // Puedes descomentar esto un momento si quieres ver qué llega
  // console.log("Respuesta login:", data);
  // console.log("Usuario bruto:", rawUser);

  const u = rawUser;

  // 🔽 Normalizar siempre lo que se guarda en localStorage
  const normalizado = {
    id:
      Number(
        u.id ??
          u.id_usuario ??
          u.id_coordinador ??
          u?.evaluador?.id_evaluador
      ) || null,

    username: u.username ?? u.correo ?? u.email ?? userOrCorreo,
    email: u.email ?? u.correo ?? null,

    nombre:
      u.nombre ??
      u.nombres ??
      u?.evaluador?.nombre_evaluado ??
      "",

    apellidos:
      u.apellidos ??
      u.apellido ??
      u?.evaluador?.apellidos_evaluador ??
      "",

    id_area:
      Number(
        u.id_area ??
          u.areaId ??
          u?.coordinador_area?.id_area ??
          u?.responsable_area?.id_area ??
          u?.evaluador?.id_area
      ) || null,

    rol: (u.rol ?? u.role ?? "COORDINADOR") || null,
  };

  // Guardar en localStorage
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  localStorage.setItem("usuario", JSON.stringify(normalizado));

  return { ...data, user: normalizado };
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

export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}