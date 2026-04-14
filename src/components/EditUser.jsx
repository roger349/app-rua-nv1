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
import { useEffect, useState } from "react";

export default function EditUser({
  open,
  onOpenChange,
  user,
  onSaved,
}) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  // cargar datos del usuario al abrir
  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  if (!form) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await UsersService.update(form.id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        status: form.status,
        role: form.role,
      });

      onSaved(form);      // 🔥 avisamos al padre
      onOpenChange(false);
    } catch (error) {
      console.error("Error al editar usuario", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
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
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
