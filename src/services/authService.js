import api from "@/lib/api";

// ============================
// LOGIN
// ============================
export const login = async (email, password) => {
  const res = await api.post("http://127.0.0.1:8000/api/login", { email, password }); // 👈 sin /api

  localStorage.setItem("token", res.data.token);

  return res.data;
};

// ============================
// LOGOUT
// ============================
export const logout = () => {
  localStorage.removeItem("token");
};

// ============================
// FORGOT PASSWORD
// ============================
export const forgotPassword = async (email) => {
  const res = await api.post("/forgot-password", { email });
  return res.data;
};

// ============================
// RESET PASSWORD
// ============================
export const resetPassword = async ({ email, token, password }) => {
  const res = await api.post("/reset-password", {
    email,
    token,
    password,
    password_confirmation: password,
  });

  return res.data;
}; 
