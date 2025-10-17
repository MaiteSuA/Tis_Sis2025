import { api } from "./api";
import { getToken } from "./auth";
const t = () => getToken();
export const listUsers = () => api("/users",{token:t()});
export const updateUser = (id,data) => api(`/users/${id}`,{method:"PUT",body:data,token:t()});
export const deactivateUser = (id) => api(`/users/${id}/deactivate`,{method:"PATCH",token:t()});
export const reactivateUser = (id) => api(`/users/${id}/reactivate`,{method:"PATCH",token:t()});
export const resetPassword = (id) => api(`/users/${id}/reset-password`,{method:"POST",token:t()});

