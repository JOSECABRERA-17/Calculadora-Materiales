
const formulario = document.getElementById("form-recuperar");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nombre = document.getElementById("Nombre").value;
    const correo = document.getElementById("Correo").value;
    const nuevaContraseña = document.getElementById("NuevaContraseña").value;
    const confirmarContraseña = document.getElementById("ConfirmarContraseña").value;

    if (nuevaContraseña !== confirmarContraseña) {
        alert("Las contraseñas nuevas no coinciden");
        return;
    }

    try {
        const respuesta = await fetch("/api/recuperar-contrasena", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo,
                nueva_contrasena: nuevaContraseña
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.error || "No se pudo actualizar la contraseña");
            return;
        }

        alert("Contraseña actualizada correctamente");
        window.location.href = "1. INICIO_SESION.html";

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor");
    }

});
