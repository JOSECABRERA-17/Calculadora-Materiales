const formulario = document.getElementById("form-columna");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const ancho = parseFloat(document.getElementById("Ancho").value);
    const profundidad = parseFloat(document.getElementById("Profundidad").value);
    const alto = parseFloat(document.getElementById("Alto").value);

    const volumen = ancho * profundidad * alto;
    const cemento = volumen * 7.5;
    const arena = volumen * 0.016;
    const piedra = volumen * 0.016;
    const hierro10 = volumen * 6;
    const hierro4 = volumen * 3;

    document.getElementById("Volumen").value = volumen.toFixed(2);
    document.getElementById("Cemento").value = cemento.toFixed(2);
    document.getElementById("Arena").value = arena.toFixed(2);
    document.getElementById("Piedra").value = piedra.toFixed(2);
    document.getElementById("Hierro10").value = hierro10.toFixed(2);
    document.getElementById("Hierro4").value = hierro4.toFixed(2);

});