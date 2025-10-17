import { api } from "./api";
export const login = (email, password) => api("/auth/login",{method:"POST",body:{email,password}});
export const getToken = () => localStorage.getItem("token");
export const setSession = ({ token, user }) => { localStorage.setItem("token",token); localStorage.setItem("user",JSON.stringify(user)); };
export const clearSession = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); };
export const getCurrentUser = () => JSON.parse(localStorage.getItem("user")||"null");

