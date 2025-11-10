//  src/api/auth.js

//  Función asíncrona que envía la solicitud de login al backend
export async function loginApi({ username, password, role }) {
  // Se realiza una petición HTTP tipo POST al endpoint del backend
  const res = await fetch('http://localhost:3000/api/auth/login', { // ← URL del backend
    method: 'POST', // Método POST porque enviamos datos
    headers: { 
      'Content-Type': 'application/json', // Indicamos que el cuerpo de la petición será JSON
    },
    // Convertimos los datos del formulario (usuario, contraseña y rol) a JSON
    body: JSON.stringify({ username, password, role }),
  });

  // Esperamos la respuesta del servidor y la convertimos en objeto JSON
  const data = await res.json();

  // Validamos si la respuesta fue exitosa:
  //  `res.ok` es false si el HTTP status no fue 2xx
  //  `data.ok` viene desde tu backend (true/false según el login)
  if (!res.ok || !data.ok) {
    // Lanzamos un error con el mensaje del backend o un mensaje por defecto
    throw new Error(data.error || 'Login failed');
  }

  //  Si todo salió bien:
  // Guardamos el token y los datos del usuario en el almacenamiento local del navegador
  localStorage.setItem('token', data.token);                // Token JWT
  localStorage.setItem('user', JSON.stringify(data.user));  // Información del usuario (objeto convertido a string)

  // Retornamos la data completa para usarla en el frontend (por ejemplo, redirección o estado)
  return data;
}
