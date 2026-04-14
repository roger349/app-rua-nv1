import { Link, useNavigate } from "react-router-dom"
import { LogOut, Users } from "lucide-react"
import { SessionsService } from "@/services/sessionsService"

export default function Header() {
  const navigate = useNavigate()

  const logout = async () => {
    const sessionId = localStorage.getItem("sessionId")
    console.log("SESSION ID AL LOGOUT:", sessionId)

    try {
      if (sessionId) {
        await SessionsService.close(sessionId)
      }
    } catch (error) {
      console.error("Error cerrando sesión", error)
    } finally {
      localStorage.clear()
      navigate("/login")
    }
  }

  return (
    <header className="bg-gradient-to-r from-orange-300 to-red-400 shadow flex justify-between items-center px-6 py-4">
      <h1 className="text-xl font-bold text-indigo-600">
        Registro Único de Adoptantes
      </h1>

      <nav className="flex gap-6 items-center">
        <Link to="/users">
          <Users className="cursor-pointer hover:text-red-700" />
        </Link>

        <LogOut
          onClick={logout}
          className="cursor-pointer hover:text-red-700"
        />
      </nav>
    </header>
  )
}


