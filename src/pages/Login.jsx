import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "@/lib/api";
import { SessionsService } from "@/services/sessionsService";
import { Card } from "@/components/ui/card";
import family from "@/assets/family.jpg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Si venía de una ruta protegida, lo devolvemos allí, sino al dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1. Petición de autenticación
      const res = await api.post("/login", { email, password });

      const { token, user } = res.data;

      // 2. Validar si el usuario puede entrar
      if (user.status !== "Activo") {
        setErrorMsg("Usuario inactivo o suspendido. Contacte al administrador.");
        setLoading(false);
        return;
      }

      // 3. Guardar credenciales en el navegador inmediatamente
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 4. Registro de Sesión (Tracking en DB)
      // Lo envolvemos en un try/catch interno para que, si falla el tracking,
      // el usuario igual pueda entrar al sistema.
      try {
        await SessionsService.create({
          type: 'login' // Laravel se encarga de obtener IP y UserAgent en el controlador
        });
      } catch (sessionError) {
        console.warn("Tracking de sesión no disponible:", sessionError);
      }

      // 5. Redirección lógica
      // Cambiamos "/admin" por "/dashboard" ya que es la ruta base donde
      // el Admin verá sus iconos especiales.
      navigate("/dashboard");

    } catch (error) {
      console.error("Error en login:", error);
      const msg = error.response?.data?.message || "Credenciales incorrectas";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center gap-x-10 p-6 md:p-14 bg-slate-100">
      
      {/* SECCIÓN FORMULARIO */}
      <Card className="w-full max-w-md bg-white p-8 shadow-xl border-none">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">Bienvenido</h1>
            <p className="text-slate-500 text-sm mt-2">Ingresa tus credenciales para continuar</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Contraseña</label>
              <input
                type="password"
                className="mt-1 w-full border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3">
              <p className="text-red-700 text-xs text-center font-medium">
                {errorMsg}
              </p>
            </div>
          )}

          <button
            className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold py-2.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
            type="submit"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>

          <p className="text-sm text-center text-slate-600">
            ¿Olvidaste la contraseña?{" "}
            <Link to="/forgot-password" size="sm" className="text-orange-600 font-bold hover:underline">
              Recuperar
            </Link>
          </p>
        </form>
      </Card>

      {/* SECCIÓN IMAGEN (Oculta en móviles pequeños) */}
      <Card className="hidden lg:flex w-full max-w-md overflow-hidden border-none shadow-2xl rounded-2xl">
        <img
          className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
          src={family}
          alt="family"
        />
      </Card>

    </div>
  );
}





