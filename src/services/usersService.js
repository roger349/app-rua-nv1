import api from "@/lib/api";

const UsersService = {
  getUsers: async () => {
    const res = await api.get("/users");
    return res.data;
  },

  createUser: async (user) => {
    const res = await api.post("/users", user);
    return res.data;
  },

  updateUser: async (id, user) => {
    const res = await api.put(`/users/${id}`, user);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

export { UsersService };