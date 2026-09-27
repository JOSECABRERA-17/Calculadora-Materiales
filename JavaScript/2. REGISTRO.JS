const formulario = document.getElementById("form-registro");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = document.getElementById("Nombre").value;
    const correo = document.getElementById("Correo").value;
    const contraseña = document.getElementById("Contraseña").value;
    const confirmar = document.getElementById("ConfirmarContraseña").value;

    if (contraseña !== confirmar)
        {alert("Las contraseñas no coinciden");}
    else
        {localStorage.setItem("nombre", nombre);
        localStorage.setItem("correo", correo);
        localStorage.setItem("contraseña", contraseña);
    alert("Registro exitoso");
        window.location.href = "1. INICIO_SESION.html";}

});