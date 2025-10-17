export const ROLES = {
  ADMIN: "Administrador",
  COORD: "Coordinador",
  RESP_AREA: "Responsable Académico",
  EVALUADOR: "Evaluador",
};
export const canAccess = (role, allowed = []) => allowed.includes(role);