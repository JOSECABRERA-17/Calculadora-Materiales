
const formulario = document.getElementById("form-pisos");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const ancho = parseFloat(document.getElementById("Ancho").value);
    const largo = parseFloat(document.getElementById("Largo").value);

    // Calcular superficie y adicional del 10 %
    const superficie = ancho * largo;
    const adicional = superficie * 0.10;
    const total = superficie + adicional;

    // Mostrar resultados
    document.getElementById("Superficie").value = superficie.toFixed(2);
    document.getElementById("Adicional").value = adicional.toFixed(2);
    document.getElementById("Total").value = total.toFixed(2);

    // Obtener el usuario que inició sesión
    const usuarioId = Number(localStorage.getItem("usuario_id"));

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
        alert("No se encontró la sesión del usuario. Inicia sesión nuevamente.");
        return;
    }

    // Preparar los datos para guardar
    const datosCalculo = {
        usuario_id: usuarioId,
        tipo_calculo: "pisos",
        datos_entrada: {
            ancho: ancho,
            largo: largo
        },
        resultados: {
            superficie: Number(superficie.toFixed(2)),
            adicional: Number(adicional.toFixed(2)),
            total: Number(total.toFixed(2))
        }
    };

    // Enviar los datos a Flask
    try {
        const respuesta = await fetch("/api/calculos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosCalculo)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.error || "No se pudo guardar el cálculo.");
            return;
        }

        alert("Cálculo de pisos realizado y guardado correctamente.");

    } catch (error) {
        console.error("Error al guardar el cálculo:", error);
        alert("No se pudo conectar con el servidor. Verifica que Flask esté funcionando.");
    }

});
