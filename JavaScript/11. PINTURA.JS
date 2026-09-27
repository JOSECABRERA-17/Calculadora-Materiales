const formulario = document.getElementById("form-pintura");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const superficie = parseFloat(document.getElementById("Superficie").value);
    const rendimiento = parseFloat(document.getElementById("Rendimiento").value);

    const pintura = superficie / rendimiento;


    document.getElementById("Pintura").value = pintura.toFixed(2);
    
});