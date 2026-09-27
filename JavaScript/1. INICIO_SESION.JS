const formulario = document.getElementById("form-inicio");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const usuario = document.getElementById("Usuario").value;
    const contraseña = document.getElementById("Contraseña").value;

    const correoGuardado = localStorage.getItem("correo");
    const contraseñaGuardada = localStorage.getItem("contraseña");

    if (usuario == correoGuardado & contraseña == contraseñaGuardada)
        {alert("Inicio de sesión exitoso");
        window.location.href = "4. MENU.html";}
    else
        {alert("Usuario o contraseña incorrectos");}
});