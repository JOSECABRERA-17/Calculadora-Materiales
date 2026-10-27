
const formulario = document.getElementById("form-muro");

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const espesor = parseFloat(document.getElementById("Espesor").value);
    const largo = parseFloat(document.getElementById("Largo").value);
    const alto = parseFloat(document.getElementById("Alto").value);

    const superficie = largo * alto;
    let cemento;
    let arena;
    let ladrillos;

    if (espesor === 20) {
        cemento = superficie * 10.9;
        arena = superficie * 0.09;
        ladrillos = superficie * 90;
    } else if (espesor === 30) {
        cemento = superficie * 15.2;
        arena = superficie * 0.115;
        ladrillos = superficie * 120;
    } else {
        alert("Selecciona un espesor válido: 20 o 30.");
        return;
    }

    document.getElementById("Superficie").value = superficie.toFixed(2);
    document.getElementById("Cemento").value = cemento.toFixed(2);
    document.getElementById("Arena").value = arena.toFixed(2);
    document.getElementById("Ladrillos").value = ladrillos.toFixed(2);

    // Obtener el usuario que inició sesión
    const usuarioId = Number(localStorage.getItem("usuario_id"));

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
        alert("No se encontró la sesión del usuario. Inicia sesión nuevamente.");
        return;
    }

    // Preparar los datos del cálculo
    const datosCalculo = {
        usuario_id: usuarioId,
        tipo_calculo: "muro",
        datos_entrada: {
            espesor: espesor,
            largo: largo,
            alto: alto
        },
        resultados: {
            superficie: Number(superficie.toFixed(2)),
            cemento: Number(cemento.toFixed(2)),
            arena: Number(arena.toFixed(2)),
            ladrillos: Number(ladrillos.toFixed(2))
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

        alert("Cálculo realizado y guardado correctamente.");

    } catch (error) {
        console.error("Error al guardar el cálculo:", error);
        alert("No se pudo conectar con el servidor. Verifica que Flask esté funcionando.");
    }
});
