const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
export const api = async (path, { method="GET", body, token } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error((await res.json().catch(()=>({}))).message || `Error ${res.status}`);
  return res.status === 204 ? null : res.json();
};


