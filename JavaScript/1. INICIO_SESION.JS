
const formulario = document.getElementById("form-inicio");

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const correo = document.getElementById("Usuario").value.trim();
    const contraseña = document.getElementById("Contraseña").value;

    try {
        const respuesta = await fetch("http://127.0.0.1:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            correo: correo,
            contraseña: contraseña})
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.error || "No se pudo iniciar sesión");
            return;
        }

        localStorage.setItem("usuario_id", datos.usuario.id);
        localStorage.setItem("usuario", datos.usuario.nombre);

        alert("Inicio de sesión exitoso");
        window.location.href = "4. MENU.html";

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("No se pudo conectar con el servidor. Verifica que Flask esté funcionando.");
    }
});
