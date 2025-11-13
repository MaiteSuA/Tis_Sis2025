//  FUNCIÓN DE LOGIN: Maneja la autenticación con el backend
export async function loginApi({ username, password, role }) {
  
  //  PETICIÓN HTTP: Realiza una llamada POST al endpoint de login del backend
  const res = await fetch('http://localhost:3000/api/auth/loginBack', {
    method: 'POST', //  Método HTTP para enviar datos al servidor
    headers: { 
      'Content-Type': 'application/json' //  Especifica que el contenido es JSON
    },
    body: JSON.stringify({  //  Convierte el objeto JavaScript a string JSON
      username,  //  Nombre de usuario proporcionado
      password,  //  Contraseña proporcionada
      role       //  Rol seleccionado (Administrador, Coordinador, etc.)
    }),
  });

  //  PROCESAMIENTO DE RESPUESTA: Convierte la respuesta HTTP a objeto JavaScript
  const data = await res.json();

  // VALIDACIÓN DE RESPUESTA: Verifica si la respuesta fue exitosa
  if (!res.ok || !data.ok) {
    // MANEJO DE ERRORES: Lanza excepción con mensaje de error
    throw new Error(data.error || 'Login failed');
  }

  // ALMACENAMIENTO LOCAL: Guarda datos de sesión en el navegador
  localStorage.setItem('token', data.token); //  Token JWT para autenticación futura
  localStorage.setItem('user', JSON.stringify(data.user)); //  Datos del usuario serializados

  //  RETORNO DE DATOS: Devuelve la respuesta completa del servidor
  return data;
}