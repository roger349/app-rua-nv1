import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log('CLICK REGISTER', form)

    try {
      await api.post('/register', form)
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Error al registrar')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-300 to-slate-400">
      <form onSubmit={handleSubmit} className="bg-gradient-to-r from-slate-400 to-slate-500 p-8 rounded-xl w-96 shadow">
        <h1 className="text-xl font-bold mb-4 text-center">Registro</h1>
        <div className="">
          
      </div>
        <input name="usuario" className="input mb-4 w-full border border-fuchsia-700 rounded" placeholder="Usuario" onChange={handleChange} required /> 
        <input name="email" className="input mb-4 w-full border border-fuchsia-700 rounded" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" className="input mb-4 w-full border border-fuchsia-700 rounded" placeholder="Contraseña" onChange={handleChange} required />
        <input name="estado" className="input mb-4 w-full border border-fuchsia-700 rounded" placeholder="Estado" onChange={handleChange} required />
        <div className="">
           <button type="submit" className="btn-primary mt-4 w-full border border-fuchsia-700 hover:bg-blue-300 rounded">Registrarse</button>
           <button className="btn-primary mt-4 w-full border border-fuchsia-700 hover:bg-blue-300 rounded"
          onClick={() => navigate("/dashboard/*")}>Volver
        </button> 
        </div>
        
      </form>
    </div>
  )
}

