import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UsersService } from "@/services/usersService";
import { useState } from "react";

export default function AddUser({
  open,
  onOpenChange,
  onCreated,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Activo",
    role: "Usuario",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      const res = await UsersService.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        status: form.status,
        role: form.role,
        password: form.password,
        imagen: "/images/default.png",
      });

      onCreated(res.data);   // 🔥 avisamos al padre
      onOpenChange(false);
    } catch (error) {
      console.error("Error creando usuario", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar usuario</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label>Nombre</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div>
            <Label>Teléfono</Label>
            <Input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          <div>
            <Label>Estado</Label>
            <select
              className="w-full border rounded px-2 py-1"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option>Activo</option>
              <option>Inactivo</option>
              <option>Suspendido</option>
            </select>
          </div>

          <div>
            <Label>Rol</Label>
            <select
              className="w-full border rounded px-2 py-1"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option>Admin</option>
              <option>Usuario</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creando..." : "Crear usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
