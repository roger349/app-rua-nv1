import { useState } from "react";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    try {
      await forgotPassword(email);
      setMsg("Revisa tu email 📩");
    } catch {
      setMsg("Error ❌");
    }
  };

  return (
    <div>
      <h2>Recuperar contraseña</h2>

      <input onChange={e => setEmail(e.target.value)} placeholder="Email" />

      <button onClick={handleSubmit}>Enviar</button>

      <p>{msg}</p>
    </div>
  );
}