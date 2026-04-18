import { Link, useNavigate } from "react-router-dom"
import { LogOut, Users } from "lucide-react"
import { SessionsService } from "@/services/sessionsService"

export default function Header() {
  const navigate = useNavigate()

  const logout = async () => {
    // Ya no necesitamos buscar el sessionId manualmente aquí,
    // el servicio handleLogout se encarga de todo el proceso.
    await SessionsService.handleLogout();
  }

  return (
    <header className="bg-gradient-to-r from-orange-300 to-red-400 shadow flex justify-between items-center px-6 py-4">
      <h1 className="text-xl font-bold text-white">
        Registro Único de Adoptantes
      </h1>

      <nav className="flex gap-6 items-center">
        <Link title="Usuarios" to="/users">
          <Users className="text-white cursor-pointer hover:text-indigo-600 transition-colors" />
        </Link>

        <LogOut
          title="Cerrar Sesión"
          onClick={logout}
          className="text-white cursor-pointer hover:text-red-700 transition-colors"
        />
      </nav>
    </header>
  )
}


