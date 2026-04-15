import { useState } from "react";
import { navigate} from "react-router-dom";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

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
      <form className="bg-slate-300 p-8 rounded-xl w-96 shadow">
        <h2 className="text-xl font-bold mb-6 text-center">Recuperar contraseña </h2>
        <input onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <button onClick={handleSubmit}>Enviar</button>
        <p>{msg}</p>   
        <button type="button" onClick={() => navigate("/login")} 
        className="mt-4 w-full border border-fuchsia-700 hover:bg-blue-300 rounded p-2">
        Volver
        </button>
      </form>
    </div>
  );
}