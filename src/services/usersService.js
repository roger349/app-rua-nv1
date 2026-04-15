import api from "@/lib/api";

// GET usuarios
export const getUsers = async () => {
  const res = await api.get("/api/users");
  return res.data;
};

// POST usuario
export const createUser = async (user) => {
  const res = await api.post("/api/users", user);
  return res.data;
};

// PUT usuario
export const updateUser = async (id, user) => {
  const res = await api.put(`/api/users/${id}`, user);
  return res.data;
};

// DELETE usuario
export const deleteUser = async (id) => {
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
};