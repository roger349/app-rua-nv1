import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "@/lib/api"
import { SessionsService } from "@/services/sessionsService"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const res = await api.post("/login", { email, password })
      const { accessToken, user } = res.data

      localStorage.setItem("token", accessToken)
      localStorage.setItem("user", JSON.stringify(user))

      const sessionRes = await SessionsService.create({
        userId: user.id,
        loginAt: new Date().toISOString(),
        logoutAt: null,
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
        active: true,
      })

      localStorage.setItem("sessionId", sessionRes.data.id)

      navigate("/dashboard")
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Credenciales incorrectas")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-r from-slate-300 to-slate-400 p-8 rounded-xl w-96 shadow"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Ingreso
        </h1>

        <input type="email" className="mb-4 w-full border rounded p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />

        <input type="password" className="mb-4 w-full border rounded p-2" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        
        <button type="submit" className="w-full mt-4 border rounded p-2 hover:bg-orange-300" > Ingresar </button>

        <p className="text-sm text-center mt-4">¿Olvidaste la contraseña?{" "}
          <Link to="/ResetPassword" className="text-indigo-800 font-semibold hover:underline" >Recuperar Contraseña</Link>
        </p>
      
      </form>
    </div>
  )
}






