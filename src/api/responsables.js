// src/api/responsables.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// BACK -> UI (tabla)
function mapBackToUI(r) {
  return {
    id: r.id_responsable,
    nombres: r.nombres_evaluador,
    apellidos: r.apellidos,
    rol: 'RESPONSABLE',
    area: r?.area?.nombre_area || 'General',
    estado: true,
    correo: r.correo_electronico,
    telefono: r.telefono || '',
    nombreUsuario: (r.nombres_evaluador?.[0] || '') + (r.apellidos?.[0] || '')
  };
}

// UI(form) -> BACK (POST/PUT)
function mapUIToBack(f) {
  return {
    nombres_evaluador: f.nombres,
    apellidos: f.apellidos,
    correo_electronico: f.correo,
    usuario_responsable: ((f.nombres?.[0] || '') + (f.apellidos?.[0] || '')).toUpperCase(),
    pass_responsable: f.carnet || f.password || f.telefono || '123456',
    carnet: f.carnet,
    id_area: Number(f.areaId),
  };
}

export async function fetchResponsables() {
  const r = await fetch(`${BASE}/responsables`);
  if (!r.ok) throw new Error('Error al listar responsables');
  const { data } = await r.json();
  return data.map(mapBackToUI);
}

export async function createResponsable(form) {
  const payload = mapUIToBack(form);
  const r = await fetch(`${BASE}/responsables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await r.json();
  if (!r.ok) throw new Error(json?.error || 'Error al crear responsable');
  return mapBackToUI(json.data);
}

export async function updateResponsable(id, form) {
  const payload = mapUIToBack(form);
  const r = await fetch(`${BASE}/responsables/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await r.json();
  if (!r.ok) throw new Error(json?.error || 'Error al actualizar responsable');
  return mapBackToUI(json.data);
}

export async function deleteResponsable(id) {
  const r = await fetch(`${BASE}/responsables/${id}`, { method: 'DELETE' });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j?.error || 'Error al eliminar responsable');
  }
  return true;
}

