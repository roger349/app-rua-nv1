import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR REQUEST → agrega token automáticamente
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

// INTERCEPTOR RESPONSE → manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Sesión expirada");

      localStorage.removeItem("token");

      // redirección según router
      window.location.href = "/#/login"; // HashRouter
      // window.location.href = "/login"; // BrowserRouter
    }

    if (status === 500) {
      console.error("Error del servidor");
    }

    return Promise.reject(error);
  }
);

export default api;