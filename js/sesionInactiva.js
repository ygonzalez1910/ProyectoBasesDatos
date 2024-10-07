function conteoSesionInactiva() {
    var tiempo = 600;
    window.setInterval(function() {
        document.onmousemove = function() {
            tiempo = 600;
        };
        tiempo--;

        if (tiempo <= 0) {
            location.href = "cerrarSesion.php";
        }
    },1000);
}

window.onload = function() {
    conteoSesionInactiva();
};