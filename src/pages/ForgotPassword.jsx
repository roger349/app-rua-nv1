import { useState } from "react";
import { forgotPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      await forgotPassword(email);
      setMsg("Revisa tu email");
    } catch {
      setMsg("Error");
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-gradient-to-r from-slate-300 to-slate-400 p-8 rounded-xl w-96 shadow">
        <h1 className="text-xl font-bold mb-6 text-center">Recuperar contraseña </h1>
        <input className="mt-4 w-full border border-fuchsia-700 hover:bg-blue-300 rounded p-2" onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <button className="mt-4 w-full border border-fuchsia-700 hover:bg-blue-300 rounded p-2" onClick={handleSubmit}>Enviar</button>
        <p>{msg}</p>   
        <button type="button" onClick={() => navigate("/login")} 
        className="mt-4 w-full border border-fuchsia-700 hover:bg-blue-300 rounded p-2">
        Volver
        </button>
      </form>
    </div>
  );
}