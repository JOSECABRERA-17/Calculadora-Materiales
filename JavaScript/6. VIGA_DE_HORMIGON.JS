const formulario = document.getElementById("form-viga");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const ancho = parseFloat(document.getElementById("Ancho").value);
    const largo = parseFloat(document.getElementById("Largo").value);
    const alto = parseFloat(document.getElementById("Alto").value);

    const volumen = ancho * largo * alto;
    const cemento = volumen * 9;
    const arena = volumen * 0.02;
    const piedra = volumen * 0.02;
    const hierro8 = volumen * 4;
    const hierro4 = volumen * 3;

    document.getElementById("Volumen").value = volumen.toFixed(2);
    document.getElementById("Cemento").value = cemento.toFixed(2);
    document.getElementById("Arena").value = arena.toFixed(2);
    document.getElementById("Piedra").value = piedra.toFixed(2);
    document.getElementById("Hierro8").value = hierro8.toFixed(2);
    document.getElementById("Hierro4").value = hierro4.toFixed(2);

});