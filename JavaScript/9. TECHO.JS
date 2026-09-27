const formulario = document.getElementById("form-techo");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const ancho = parseFloat(document.getElementById("Ancho").value);
    const largo = parseFloat(document.getElementById("Largo").value);
    const espesor = parseFloat(document.getElementById("Espesor").value);

    const superficie = ancho * largo;
    const cemento = superficie * 33;
    const arena = superficie * 0.072;
    const piedra = superficie * 0.072;
    const hierro6 = superficie * 4;
    const hierro8 = superficie * 7;

    document.getElementById("Superficie").value = superficie.toFixed(2);
    document.getElementById("Cemento").value = cemento.toFixed(2);
    document.getElementById("Arena").value = arena.toFixed(2);
    document.getElementById("Piedra").value = piedra.toFixed(2);
    document.getElementById("Hierro6").value = hierro6.toFixed(2);
    document.getElementById("Hierro8").value = hierro8.toFixed(2);
});