const formulario = document.getElementById("form-pisos");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const ancho = parseFloat(document.getElementById("Ancho").value);
    const largo = parseFloat(document.getElementById("Largo").value);

    const superficie = ancho * largo;
    const adicional = superficie * 0.10;
    const total = superficie + adicional;


    document.getElementById("Superficie").value = superficie.toFixed(2);
    document.getElementById("Adicional").value = adicional.toFixed(2);
    document.getElementById("Total").value = total.toFixed(2);
    
});