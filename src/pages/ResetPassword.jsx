import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;

  const [lockTime, setLockTime] = useState(null);
  const LOCK_DURATION = 2 * 60;

  const [timeLeft, setTimeLeft] = useState(0);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= TIMER BLOQUEO =================
  useEffect(() => {
    if (!lockTime) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, lockTime - Date.now());
      setTimeLeft(Math.floor(remaining / 1000));

      if (remaining <= 0) {
        setLockTime(null);
        setAttempts(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockTime]);

  // ================= PASSWORD RULES =================
  const passwordRules = (password) => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  });

  const rules = passwordRules(password);
  const isStrong = Object.values(rules).every(Boolean);
  const coinciden = password === confirm && password !== "";

  // ================= OTP =================
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    setOtp(newValues.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // ================= LOG =================
  const addLog = (message) => {
    const entry = {
      time: new Date().toLocaleTimeString(),
      message,
    };
    setLogs((prev) => [entry, ...prev]);
  };

  // ================= HANDLERS =================

  const handleEmail = async () => {
    if (!email) {
      alert("Ingrese un email");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/forgot-password", { email });

      setStep(2);
      setAttempts(0);
      addLog("Código enviado al email 📩");
    } catch (e) {
      addLog("Error al enviar código");
      alert("Error al enviar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (lockTime) {
      alert("Bloqueado temporalmente");
      return;
    }

    if (otp.length !== 6) {
      alert("Ingrese el código completo");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/verify-otp", { email, otp });

      setStep(3);
      addLog("OTP verificado correctamente ✅");
    } catch {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      addLog("OTP incorrecto ❌");

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCK_DURATION * 1000;
        setLockTime(lockUntil);
        addLog("Usuario bloqueado temporalmente 🔒");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!coinciden) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!isStrong) {
      alert("Contraseña débil");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/reset-password", {
        email,
        token: otp, // usar "otp" como token
        password,
        password_confirmation: password,
      });

      addLog("Contraseña actualizada ✅");

      // limpiar
      setPassword("");
      setConfirm("");
      setOtp("");
      setOtpValues(["", "", "", "", "", ""]);

      setTimeout(() => navigate("/login"), 1500);
    } catch {
      addLog("Error al actualizar contraseña ❌");
      alert("Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-slate-300 p-8 rounded-xl w-96 shadow">
        <h2 className="text-xl font-bold mb-6 text-center">
          Recuperar contraseña
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 border p-2"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="button"
              onClick={handleEmail}
              disabled={loading}
              className="w-full bg-white hover:bg-blue-400 border p-2"
            >
              {loading ? "Enviando..." : "Enviar código"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            {lockTime && (
              <p className="text-red-500 text-center mb-2">
                Bloqueado: {timeLeft}s
              </p>
            )}

            <div className="flex gap-2 mb-4 justify-center">
              {otpValues.map((v, i) => (
                <input
                  key={i}
                  maxLength="1"
                  value={v}
                  ref={(el) => (inputsRef.current[i] = el)}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-10 h-10 text-center border"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading || !!lockTime}
              className="w-full bg-blue-500 text-white p-2"
            >
              {loading ? "Verificando..." : "Verificar"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-2 border p-2"
            />

            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              👁️
            </button>

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar"
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mb-4 border p-2"
            />

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-green-500 text-white p-2"
            >
              {loading ? "Guardando..." : "Cambiar contraseña"}
            </button>
          </>
        )}

        {/* LOGS */}
        <div className="mt-6 text-xs max-h-32 overflow-auto">
          <p className="font-bold">Logs:</p>
          {logs.map((log, i) => (
            <p key={i}>
              [{log.time}] {log.message}
            </p>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-4 w-full border hover:bg-blue-300 rounded p-2"
        >
          Volver
        </button>
      </form>
    </div>
  );
}
