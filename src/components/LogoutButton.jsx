import { useNavigate } from "react-router-dom"
import { SessionsService } from "@/services/sessionsService"
import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId")

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
    <Button
      variant="destructive"
      onClick={handleLogout}
    >
      Cerrar sesión
    </Button>
  )
}
