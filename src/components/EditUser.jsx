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
import { Loader2 } from "lucide-react";

export default function EditUser({
  open,
  onOpenChange,
  user,
  onSaved,
}) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Cargar datos del usuario al abrir el modal
  useEffect(() => {
    if (user) {
      setForm({ ...user }); 
      setErrorMsg("");
    }
  }, [user]);

  if (!form) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      setErrorMsg("El nombre y el email son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      // Enviamos la actualización al backend
      await UsersService.updateUser(form.id, {
        name: form.name,
        email: form.email,
        status: form.status,
        role: form.role,
      });

      onSaved(form); 
      onOpenChange(false);
    } catch (error) {
      console.error("Error al editar usuario", error);
      const msg = error.response?.data?.message || "Error al actualizar los datos.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Editar Usuario</DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Banner de Error */}
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre Completo</Label>
            <Input
              id="edit-name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Correo Electrónico</Label>
            <Input
              id="edit-email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <select
                className="w-full h-10 border rounded-md px-3 text-sm bg-white focus:ring-2 focus:ring-slate-200 outline-none"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Suspendido">Suspendido</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Rol</Label>
              <select
                className="w-full h-10 border rounded-md px-3 text-sm bg-white focus:ring-2 focus:ring-slate-200 outline-none"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Usuario">Usuario</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="bg-slate-300 hover:bg-red-400 text-black min-w-[140px] shadow-lg shadow-slate-200"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-slate-300 hover:bg-red-400 text-black min-w-[140px] shadow-lg shadow-slate-200"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}