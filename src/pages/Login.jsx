import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "@/lib/api";
import { SessionsService } from "@/services/sessionsService";
import { Card } from "@/components/ui/card"
import family from "@/assets/family.jpg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

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
      // LOGIN
      const res = await api.post("/api/login", { email, password });

      // Ajustar según tu backend
      const token = res.data.token || res.data.accessToken;
      const user = res.data.user;

      // Guardar sesión
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Registrar sesión (opcional)
      try {
        const sessionRes = await SessionsService.create({
          userId: user.id,
          loginAt: new Date().toISOString(),
          logoutAt: null,
          ip: "127.0.0.1",
          userAgent: navigator.userAgent,
          active: true,
        });

        localStorage.setItem("sessionId", sessionRes.data.id);
      } catch (e) {
        console.warn("No se pudo registrar la sesión");
      }

      // Redirección
      navigate(from);

    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Credenciales incorrectas";

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center gap-x-20 p-14 m-0">
      <Card className="w-full max-w-sm md:max-w-md flex items-center justify-center bg-orange-100 p-14">
        <form className="bg-gradient-to-r from-slate-300 to-slate-400 ml-2 p-8 w-full shadow"
          onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Ingreso
          </h1>

          {/* EMAIL */}
          <input
            type="email"
            className="mb-4 w-full border rounded p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            className="mb-4 w-full border rounded p-2"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ERROR */}
          {errorMsg && (
            <p className="text-red-600 text-sm mb-2 text-center">
              {errorMsg}
            </p>
          )}

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 border rounded p-2 hover:bg-orange-300 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          {/* RECUPERAR PASSWORD */}
          <p className="text-sm text-center mt-4">
            ¿Olvidaste la contraseña?{" "}
            <Link to="/forgot-password" className="text-indigo-800 font-semibold hover:underline">Recuperar Contraseña</Link>
          </p>
        </form>
      </Card>
      <Card className="w-full max-w-sm md:max-w-md flex">
        <img className="w-full h-full object-cover" src={family}/>
      </Card>
    </div>
  );
}





