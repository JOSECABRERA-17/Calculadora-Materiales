const formulario = document.getElementById("form-contrapiso");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const ancho = parseFloat(document.getElementById("Ancho").value);
    const largo = parseFloat(document.getElementById("Largo").value);
    const espesor = parseFloat(document.getElementById("Espesor").value);

    const volumen = ancho * largo * espesor;
    const cemento = volumen * 105;
    const arena = volumen * 0.45;
    const piedra = volumen * 0.9;

    document.getElementById("Volumen").value = volumen.toFixed(2);
    document.getElementById("Cemento").value = cemento.toFixed(2);
    document.getElementById("Arena").value = arena.toFixed(2);
    document.getElementById("Piedra").value = piedra.toFixed(2);

});