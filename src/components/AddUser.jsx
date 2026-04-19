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
import { Loader2, UserCheck } from "lucide-react"; // Añadí UserCheck para un toque visual

export default function AddUser({
  open,
  onOpenChange,
  onCreated,
}) {
  // El estado inicial mantiene "Activo" de forma interna
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
    if (!form.name || !form.email || !form.password) {
      setErrorMsg("Nombre, Email y Contraseña son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const user = await UsersService.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        status: form.status, // Se envía "Activo" automáticamente
        role: form.role,
        imagen: "/images/default.png", 
      });

      onCreated(user); 
      resetForm();
      onOpenChange(false);

    } catch (error) {
      console.error("Error creando usuario", error);
      const msg = error.response?.data?.message || "Error al crear el usuario.";
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
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <UserCheck className="text-green-600" /> Agregar Usuario
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 text-red-700 text-xs font-medium animate-in fade-in">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              placeholder="Ej: Juan Pérez"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-white/50"
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
              className="bg-white/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Visualización del Estado (Solo lectura) */}
            <div className="space-y-2">
              <Label className="text-slate-500">Estado Inicial</Label>
              <div className="h-10 px-3 flex items-center text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-md">
                Activo
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rol del Sistema</Label>
              <select
                className="w-full border rounded-md h-10 px-3 text-sm bg-white focus:ring-2 focus:ring-slate-200 outline-none border-slate-200"
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
            className="bg-slate-300 hover:bg-red-400 text-black min-w-[140px] shadow-lg shadow-slate-200"
          >
            Cancelar
          </Button>

          <Button 
            onClick={handleCreate} 
            disabled={loading}
            className="bg-slate-300 hover:bg-red-400 text-black min-w-[140px] shadow-lg shadow-slate-200"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
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