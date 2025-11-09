// src/api/responsables.js
// URL base de la API 
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/* ================================================================
   FUNCIÓN: mapBackToUI()
   Convierte un objeto recibido del backend (BACK) al formato que
   la interfaz (UI) necesita para mostrar los datos correctamente.
   ================================================================= */
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
    nombreUsuario: (r.nombres_evaluador?.[0] || '') + (r.apellidos?.[0] || ''), // Iniciales del usuario
  };
}

/* ================================================================
  FUNCIÓN: mapUIToBack()
   Convierte un objeto desde el formulario (UI) al formato que
   el backend (BACK) necesita para crear o actualizar registros.
   ================================================================= */
function mapUIToBack(f) {
  return {
    nombres_evaluador: f.nombres,
    apellidos: f.apellidos,
    correo_electronico: f.correo,
    usuario_responsable: ((f.nombres?.[0] || '') + (f.apellidos?.[0] || '')).toUpperCase(),
    pass_responsable: f.ci || f.password || f.telefono || '123456',
    carnet: f.carnet,
    id_area: Number(f.areaId),
  };
}

/* ================================================================
   FUNCIÓN: fetchResponsables()
   Obtiene la lista de responsables desde el backend.
   ================================================================= */
export async function fetchResponsables() {
  const r = await fetch(`${BASE}/responsables`);
  if (!r.ok) throw new Error('Error al listar responsables');
  const { data } = await r.json();
  return data.map(mapBackToUI);
}

/* ================================================================
   FUNCIÓN: createResponsable()
   Crea un nuevo responsable en la base de datos.
   ================================================================= */
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

/* ================================================================
   FUNCIÓN: updateResponsable()
   Actualiza los datos de un responsable existente.
   ================================================================= */
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

/* ================================================================
   FUNCIÓN: deleteResponsable()
   Elimina un responsable de la base de datos por ID.
   ================================================================= */
export async function deleteResponsable(id) {
  const r = await fetch(`${BASE}/responsables/${id}`, { method: 'DELETE' });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j?.error || 'Error al eliminar responsable');
  }
  return true;
}

