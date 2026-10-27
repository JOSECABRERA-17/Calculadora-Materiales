
const formulario = document.getElementById("form-contrapiso");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const ancho = parseFloat(document.getElementById("Ancho").value);
    const largo = parseFloat(document.getElementById("Largo").value);
    const espesor = parseFloat(document.getElementById("Espesor").value);

    // Calcular materiales: se conservan tus fórmulas
    const volumen = ancho * largo * espesor;
    const cemento = volumen * 105;
    const arena = volumen * 0.45;
    const piedra = volumen * 0.9;

    // Mostrar resultados
    document.getElementById("Volumen").value = volumen.toFixed(2);
    document.getElementById("Cemento").value = cemento.toFixed(2);
    document.getElementById("Arena").value = arena.toFixed(2);
    document.getElementById("Piedra").value = piedra.toFixed(2);

    // Obtener el usuario que inició sesión
    const usuarioId = Number(localStorage.getItem("usuario_id"));

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
        alert("No se encontró la sesión del usuario. Inicia sesión nuevamente.");
        return;
    }

    // Preparar los datos para SQLite
    const datosCalculo = {
        usuario_id: usuarioId,
        tipo_calculo: "contrapiso",
        datos_entrada: {
            ancho: ancho,
            largo: largo,
            espesor: espesor
        },
        resultados: {
            volumen: Number(volumen.toFixed(2)),
            cemento: Number(cemento.toFixed(2)),
            arena: Number(arena.toFixed(2)),
            piedra: Number(piedra.toFixed(2))
        }
    };

    // Enviar el cálculo a Flask
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

        alert("Cálculo de contrapiso realizado y guardado correctamente.");

    } catch (error) {
        console.error("Error al guardar el cálculo:", error);
        alert("No se pudo conectar con el servidor. Verifica que Flask esté funcionando.");
    }

});
