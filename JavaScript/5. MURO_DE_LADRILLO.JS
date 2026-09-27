const formulario = document.getElementById("form-muro");

formulario.addEventListener("submit", function(event) {

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
    ladrillos = superficie * 90;}

    else if (espesor === 30) {
    cemento = superficie * 15.2;
    arena = superficie * 0.115;
    ladrillos = superficie * 120;
    }
    
    document.getElementById("Superficie").value = superficie.toFixed(2);
    document.getElementById("Cemento").value = cemento.toFixed(2);
    document.getElementById("Arena").value = arena.toFixed(2);
    document.getElementById("Ladrillos").value = ladrillos.toFixed(0);

});