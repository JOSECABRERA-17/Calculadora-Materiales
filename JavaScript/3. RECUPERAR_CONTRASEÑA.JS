const formulario = document.getElementById("form-recuperar");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = document.getElementById("Nombre").value;
    const correo = document.getElementById("Correo").value;
    const nuevaContraseña = document.getElementById("NuevaContraseña").value;
    const confirmarContraseña = document.getElementById("ConfirmarContraseña").value;

    const nombreGuardado = localStorage.getItem("nombre");
    const correoGuardado = localStorage.getItem("correo");

    if (nombre !== nombreGuardado | correo !== correoGuardado)
        {alert("El nombre de usuario o correo no coinciden");}
    else if (nuevaContraseña !== confirmarContraseña)
        {alert("Las contraseñas nuevas no coinciden");}
    else
        {localStorage.setItem("contraseña", nuevaContraseña);
        alert("Contraseña actualizada correctamente");
        window.location.href = "1. INICIO_SESION.html";}

});