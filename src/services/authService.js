import api from "@/lib/api";

// LOGIN
export const login = async (email, password) => {
  const res = await api.post("/api/login", { email, password });

  localStorage.setItem("token", res.data.token);

  return res.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const res = await api.post("/api/forgot-password", { email });
  return res.data;
};

// RESET PASSWORD
export const resetPassword = async ({ email, token, password }) => {
  const res = await api.post("/api/reset-password", {
    email,
    token,
    password,
    password_confirmation: password,
  });

  return res.data;
};