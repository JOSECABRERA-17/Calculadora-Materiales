
const formulario = document.getElementById("form-columna");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const ancho = parseFloat(document.getElementById("Ancho").value);
    const profundidad = parseFloat(document.getElementById("Profundidad").value);
    const alto = parseFloat(document.getElementById("Alto").value);

    // Calcular materiales: se conservan tus fórmulas
    const volumen = ancho * profundidad * alto;
    const cemento = volumen * 7.5;
    const arena = volumen * 0.016;
    const piedra = volumen * 0.016;
    const hierro10 = volumen * 6;
    const hierro4 = volumen * 3;

    // Mostrar resultados
    document.getElementById("Volumen").value = volumen.toFixed(2);
    document.getElementById("Cemento").value = cemento.toFixed(2);
    document.getElementById("Arena").value = arena.toFixed(2);
    document.getElementById("Piedra").value = piedra.toFixed(2);
    document.getElementById("Hierro10").value = hierro10.toFixed(2);
    document.getElementById("Hierro4").value = hierro4.toFixed(2);

    // Obtener el usuario que inició sesión
    const usuarioId = Number(localStorage.getItem("usuario_id"));

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
        alert("No se encontró la sesión del usuario. Inicia sesión nuevamente.");
        return;
    }

    // Preparar los datos para guardar
    const datosCalculo = {
        usuario_id: usuarioId,
        tipo_calculo: "columna",
        datos_entrada: {
            ancho: ancho,
            profundidad: profundidad,
            alto: alto
        },
        resultados: {
            volumen: Number(volumen.toFixed(2)),
            cemento: Number(cemento.toFixed(2)),
            arena: Number(arena.toFixed(2)),
            piedra: Number(piedra.toFixed(2)),
            hierro10: Number(hierro10.toFixed(2)),
            hierro4: Number(hierro4.toFixed(2))
        }
    };

    // Enviar a Flask
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

        alert("Cálculo de columna realizado y guardado correctamente.");

    } catch (error) {
        console.error("Error al guardar el cálculo:", error);
        alert("No se pudo conectar con el servidor. Verifica que Flask esté funcionando.");
    }

});
