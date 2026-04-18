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
import { Loader2 } from "lucide-react";

export default function AddUser({
  open,
  onOpenChange,
  onCreated,
}) {
  // Estado inicial con "Activo" por defecto
  const initialState = {
    name: "",
    email: "",
    status: "Activo",
    role: "Usuario",
    password: "",
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg(""); 
  };

  const resetForm = () => {
    setForm(initialState);
    setErrorMsg("");
  };

  const handleCreate = async () => {
    // Validación de campos obligatorios
    if (!form.name || !form.email || !form.password) {
      setErrorMsg("Nombre, Email y Contraseña son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      // Enviamos los datos al backend
      const user = await UsersService.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        status: form.status,
        role: form.role,
        imagen: "/images/default.png", 
      });

      // Si el backend responde con éxito:
      onCreated(user); 
      resetForm();
      onOpenChange(false);

    } catch (error) {
      console.error("Error creando usuario", error);
      // Capturamos el error de validación de Laravel (ej: Email ya registrado)
      const msg = error.response?.data?.message || "Error al crear el usuario. Verifique los datos.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) resetForm();
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Agregar Usuario</DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Alerta de Error */}
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Ej: Juan Pérez"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <select
                className="w-full border rounded-md h-10 px-3 text-sm bg-white focus:ring-2 focus:ring-slate-200 outline-none"
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
                className="w-full border rounded-md h-10 px-3 text-sm bg-white focus:ring-2 focus:ring-slate-200 outline-none"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                <option value="Usuario">Usuario</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button 
            onClick={handleCreate} 
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-900 text-white min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear usuario"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}