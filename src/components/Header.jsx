import { useState } from "react"
import { Link } from "react-router-dom"
import { LogOut, Users, ShieldAlert, X } from "lucide-react"
import { SessionsService } from "@/services/sessionsService"

export default function Header() {
  const [showBanner, setShowBanner] = useState(false);

  // Obtenemos el usuario del storage
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = async () => {
    await SessionsService.handleLogout();
  }

  const handleUsersClick = (e) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // ESTO TE DIRÁ EN LA CONSOLA QUÉ HAY DENTRO DE USER
    console.log("Datos del usuario:", user);

    // Verificamos si existe el usuario y si su rol es admin (en minúsculas por seguridad)
    const isAdmin = user && user.role?.toLowerCase() === 'admin';

    if (!isAdmin) {
      e.preventDefault();
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 5000);
    }
  }

  return (
    <>
      {/* BANNER FLOTANTE */}
      {showBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-800 border border-slate-700 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/20 p-2 rounded-lg">
                <ShieldAlert className="text-red-400" size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm">Acceso restringido</p>
                <p className="text-xs text-slate-400">No tienes permisos para administrar usuarios.</p>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="hover:bg-slate-700 p-1 rounded-full transition-colors"
            >
              <X size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
      )}

      <header className="bg-gradient-to-r from-slate-400 to-blue-300 shadow flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-white">
          Registro Único de Adoptantes
        </h1>

        <nav className="flex gap-6 items-center">
          <Link title="Usuarios" to="/users" onClick={handleUsersClick}>
            <Users className="text-white cursor-pointer hover:text-indigo-600 transition-colors" />
          </Link>

          <LogOut
            title="Cerrar Sesión"
            onClick={logout}
            className="text-white cursor-pointer hover:text-red-700 transition-colors"
          />
        </nav>
      </header>
    </>
  )
}


