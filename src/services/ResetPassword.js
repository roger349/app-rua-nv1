
const pass1 = document.getElementById("pass1");
const pass2 = document.getElementById("pass2");
const boton = document.getElementById("Recuperar");
const mensaje = document.getElementById("mensaje");

function verificarPasswords() {
  if (pass1.value === pass2.value && pass1.value !== "") {
    boton.disabled = false;
    mensaje.textContent = "Las contraseñas coinciden ✅";
    mensaje.style.color = "green";
  } else {
    boton.disabled = true;
    mensaje.textContent = "Las contraseñas no coinciden ❌";
    mensaje.style.color = "red";
  }
}

pass1.addEventListener("input", verificarPasswords);
pass2.addEventListener("input", verificarPasswords);