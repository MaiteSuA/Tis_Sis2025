// src/api/auth.js
export async function loginApi({ username, password, role }) {
  const res = await fetch('http://localhost:3000/api/auth/login', { // cambia el loginBack por login
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role }),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'Login failed');
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}
