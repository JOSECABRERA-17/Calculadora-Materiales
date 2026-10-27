
const formulario = document.getElementById("form-techo");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const ancho = parseFloat(document.getElementById("Ancho").value);
    const largo = parseFloat(document.getElementById("Largo").value);
    const espesor = parseFloat(document.getElementById("Espesor").value);

    // Calcular materiales: se conservan tus fórmulas
    const superficie = ancho * largo;
    const cemento = superficie * 33;
    const arena = superficie * 0.072;
    const piedra = superficie * 0.072;
    const hierro6 = superficie * 4;
    const hierro8 = superficie * 7;

    // Mostrar resultados
    document.getElementById("Superficie").value = superficie.toFixed(2);
    document.getElementById("Cemento").value = cemento.toFixed(2);
    document.getElementById("Arena").value = arena.toFixed(2);
    document.getElementById("Piedra").value = piedra.toFixed(2);
    document.getElementById("Hierro6").value = hierro6.toFixed(2);
    document.getElementById("Hierro8").value = hierro8.toFixed(2);

    // Obtener el usuario que inició sesión
    const usuarioId = Number(localStorage.getItem("usuario_id"));

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
        alert("No se encontró la sesión del usuario. Inicia sesión nuevamente.");
        return;
    }

    // Preparar los datos para guardar
    const datosCalculo = {
        usuario_id: usuarioId,
        tipo_calculo: "techo",
        datos_entrada: {
            ancho: ancho,
            largo: largo,
            espesor: espesor
        },
        resultados: {
            superficie: Number(superficie.toFixed(2)),
            cemento: Number(cemento.toFixed(2)),
            arena: Number(arena.toFixed(2)),
            piedra: Number(piedra.toFixed(2)),
            hierro6: Number(hierro6.toFixed(2)),
            hierro8: Number(hierro8.toFixed(2))
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

        alert("Cálculo de techo realizado y guardado correctamente.");

    } catch (error) {
        console.error("Error al guardar el cálculo:", error);
        alert("No se pudo conectar con el servidor. Verifica que Flask esté funcionando.");
    }

});
