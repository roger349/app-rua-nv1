import api from "@/lib/api";

const UsersService = {
  getUsers: async () => {
    const res = await api.get("/api/users");
    return res.data;
  },

  createUser: async (user) => {
    const res = await api.post("/api/users", user);
    return res.data;
  },

  updateUser: async (id, user) => {
    const res = await api.put(`/api/users/${id}`, user);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  },
};

export { UsersService };