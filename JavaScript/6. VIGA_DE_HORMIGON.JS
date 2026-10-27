
const formulario = document.getElementById("form-viga");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const ancho = parseFloat(document.getElementById("Ancho").value);
    const largo = parseFloat(document.getElementById("Largo").value);
    const alto = parseFloat(document.getElementById("Alto").value);

    // Calcular materiales (se conservan tus fórmulas)
    const volumen = ancho * largo * alto;
    const cemento = volumen * 9;
    const arena = volumen * 0.02;
    const piedra = volumen * 0.02;
    const hierro8 = volumen * 4;
    const hierro4 = volumen * 3;

    // Mostrar resultados
    document.getElementById("Volumen").value = volumen.toFixed(2);
    document.getElementById("Cemento").value = cemento.toFixed(2);
    document.getElementById("Arena").value = arena.toFixed(2);
    document.getElementById("Piedra").value = piedra.toFixed(2);
    document.getElementById("Hierro8").value = hierro8.toFixed(2);
    document.getElementById("Hierro4").value = hierro4.toFixed(2);

    // Identificar al usuario que inició sesión
    const usuarioId = Number(localStorage.getItem("usuario_id"));

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
        alert("No se encontró la sesión del usuario. Inicia sesión nuevamente.");
        return;
    }

    // Preparar la información para SQLite
    const datosCalculo = {
        usuario_id: usuarioId,
        tipo_calculo: "viga",
        datos_entrada: {
            ancho: ancho,
            largo: largo,
            alto: alto
        },
        resultados: {
            volumen: Number(volumen.toFixed(2)),
            cemento: Number(cemento.toFixed(2)),
            arena: Number(arena.toFixed(2)),
            piedra: Number(piedra.toFixed(2)),
            hierro8: Number(hierro8.toFixed(2)),
            hierro4: Number(hierro4.toFixed(2))
        }
    };

    // Guardar el cálculo en Flask
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

        alert("Cálculo de viga realizado y guardado correctamente.");

    } catch (error) {
        console.error("Error al guardar el cálculo:", error);
        alert("No se pudo conectar con el servidor. Verifica que Flask esté funcionando.");
    }

});
