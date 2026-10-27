
const formulario = document.getElementById("form-pintura");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const superficie = parseFloat(document.getElementById("Superficie").value);
    const rendimiento = parseFloat(document.getElementById("Rendimiento").value);

    const pintura = superficie / rendimiento;

    document.getElementById("Pintura").value = pintura.toFixed(2);

    try {

        const usuarioId = Number(localStorage.getItem("usuario_id"));

        if (!usuarioId) {
            alert("Debes iniciar sesión para guardar el cálculo.");
            return;
        }

        const datosCalculo = {
            usuario_id: usuarioId,
            tipo_calculo: "pintura",
            datos_entrada: {
                superficie: superficie,
                rendimiento: rendimiento
            },
            resultados: {
                pintura: Number(pintura.toFixed(2))
            }
        };

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

        alert("Cálculo de pintura guardado correctamente.");

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
    }

});
