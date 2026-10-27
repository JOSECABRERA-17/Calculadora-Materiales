const formulario = document.getElementById("form-registro");

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    

    const nombre = document.getElementById("Nombre").value;
    const correo = document.getElementById("Correo").value;
    const contraseña = document.getElementById("Contraseña").value;
    const confirmar = document.getElementById("ConfirmarContraseña").value;

    if (contraseña !== confirmar)
        {alert("Las contraseñas no coinciden");}

    try {
        console.log("Voy a enviar la petición a Flask");
        const respuesta = await fetch("http://127.0.0.1:5000/api/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo,
                contraseña: contraseña,
                confirmar: confirmar
            })
        });

        const datos = await respuesta.json();
        console.log("Respuesta recibida de Flask:", respuesta.status, datos);

        if (!respuesta.ok) {
            alert(datos.error || "No se pudo completar el registro");
            return;
        }

        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        formulario.reset();
        window.location.href = "1. INICIO_SESION.html";

    } catch (error) {
        alert("No se pudo conectar con el servidor. Verifica que Flask esté funcionando.");
        console.error("Error de registro:", error);
    }
});