import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json", // 👈 IMPORTANTE para Laravel
  },
});

// ============================
// REQUEST INTERCEPTOR
// ============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
// RESPONSE INTERCEPTOR
// ============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("No autenticado / sesión expirada");

      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (status === 403) {
      console.warn("No autorizado (rol)");

      // Podés redirigir a home o página 403
      window.location.href = "/";
    }

    if (status === 500) {
      console.error("Error del servidor");
    }

    return Promise.reject(error);
  }
);

// ============================
// AUTH
// ============================
export const login = async (data) => {
  const res = await api.post("/login", data);

  // Guardar token automáticamente
  localStorage.setItem("token", res.data.token);

  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

// ============================
// USER AUTH
// ============================
export const getMe = () => api.get("/user");

// ============================
// USERS (ADMIN)
// ============================
export const getUsers = () => api.get("/users");

export const createUser = (data) => api.post("/users", data);

export const updateUser = (id, data) => api.put(`/users/${id}`, data);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api; 

//=================================
// Sessions
//=================================
export const getUserSessionsPDF = async (userId) => {
  const response = await api.get(`/users/${userId}/sessions/pdf`, {
    responseType: 'blob', // 👈 Crucial para archivos binarios
  });
  return response.data;
};