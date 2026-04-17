
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const email = params.get("email");

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    if (pass !== confirm) {
      setMsg("No coinciden ");
      return;
    }

    try {
      await resetPassword({ email, token, password: pass });

      setMsg("Contraseña actualizada ");

      setTimeout(() => navigate("/login"), 1500);

    } catch {
      setMsg("Error ");
    }
  };

  return (
    <div>
      <h1>Nueva contraseña</h1>

      <input type="password" onChange={e => setPass(e.target.value)} />
      <input type="password" onChange={e => setConfirm(e.target.value)} />

      <button onClick={handleSubmit}>Guardar</button>

      <p>{msg}</p>
    </div>
  );
}