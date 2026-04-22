
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "@/lib/api";
import { SessionsService } from "@/services/sessionsService";
import { Card } from "@/components/ui/card";
import family from "@/assets/family.jpg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* VALIDACIONES */
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    /* VALIDAR EMAIL */
    if (!emailValid) {
      setErrorMsg("Ingrese un correo válido.");
      return;
    }

    /* VALIDAR PASSWORD */
    if (!passwordValid) {
      setErrorMsg("La contraseña debe tener 6 o más caracteres.");
      return;
    }

    setLoading(true);

    try {
      /* LOGIN */
      const res = await api.post("/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      /* USUARIO INACTIVO */
      if (user.status !== "Activo") {
        setErrorMsg(
          "Usuario inactivo o suspendido. Contacte al administrador."
        );
        setLoading(false);
        return;
      }

      /* GUARDAR SESIÓN */
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      /* TRACKING LOGIN */
      try {
        await SessionsService.create({
          type: "login",
        });
      } catch (sessionError) {
        console.warn("Tracking no disponible:", sessionError);
      }

      /* REDIRECCIÓN */
      navigate(from, { replace: true });

    } catch (error) {
      console.error("Error login:", error);

      setErrorMsg(
        error.response?.data?.message ||
        "Credenciales incorrectas."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center gap-x-10 p-6 md:p-14 bg-slate-100">

      {/* FORMULARIO */}
      <Card className="w-full max-w-md bg-white p-8 shadow-xl border-none rounded-2xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          autoComplete="off"
        >
          {/* TITULO */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">
              Bienvenido a R.U.A.
            </h1>

            <p className="text-slate-500 text-sm mt-2">
              Ingresa tus datos para continuar
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              autoComplete="off"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border border-slate-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-orange-200"
            />

            {email.length > 0 && !emailValid && (
              <p className="text-red-500 text-xs mt-1">
                Ingrese un correo válido.
              </p>
            )}

            {email.length > 0 && emailValid && (
              <p className="text-green-600 text-xs mt-1">
                Correo válido.
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Contraseña
            </label>

            <input
              type="password"
              autoComplete="new-password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full border border-slate-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-orange-200"
            />

            {password.length > 0 && !passwordValid && (
              <p className="text-red-500 text-xs mt-1">
                Debe tener 6 o más caracteres.
              </p>
            )}

            {password.length >= 6 && (
              <p className="text-green-600 text-xs mt-1">
                Contraseña válida.
              </p>
            )}
          </div>

          {/* ERROR GENERAL */}
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="text-red-700 text-xs text-center font-medium">
                {errorMsg}
              </p>
            </div>
          )}

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={
              loading ||
              !emailValid ||
              !passwordValid
            }
            className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold py-2.5 rounded-md hover:opacity-90 transition disabled:opacity-50 shadow-md"
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>

          {/* RECUPERAR */}
          <p className="text-sm text-center text-slate-600">
            ¿Olvidaste la contraseña?{" "}
            <Link
              to="/forgot-password"
              className="text-orange-600 font-bold hover:underline"
            >
              Recuperar
            </Link>
          </p>
        </form>
      </Card>

      {/* IMAGEN */}
      <Card className="hidden lg:flex w-full max-w-md overflow-hidden border-none shadow-2xl rounded-2xl">
        <img
          src={family}
          alt="family"
          className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-700"
        />
      </Card>
    </div>
  );
}




