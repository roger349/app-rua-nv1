// services/usersService.ts
import api from "@/lib/api";

export const UsersService = {
  getAll() {
    return api.get("/users");
  },

  create(data) {
    return api.post("/users", data);
  },

  getById(id) {
    return api.get(`/users/${id}`);
  },

  update(id, data) {
    // 🔥 PATCH en vez de PUT
    return api.patch(`/users/${id}`, data);
  },

  delete(id) {
    return api.delete(`/users/${id}`);
  },
};
