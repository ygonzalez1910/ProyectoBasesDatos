document.addEventListener("DOMContentLoaded", function() {
    // Obtener la lista de imágenes
    var imagenes = [
        "../img/banner2.jpeg",
        "../img/banner3.webp",
        "../img/banner4.webp"
    ];

    var indiceImagen = 0;
    var intervalo = 4000;

    function cambiarImagen() {
        indiceImagen++;

        if (indiceImagen >= imagenes.length) {
            indiceImagen = 0;
        }

        var contenedorBanner = document.querySelector(".contenedor-banner");
        var banner = contenedorBanner.querySelector(".banner");

        banner.src = imagenes[indiceImagen];
    }

    setInterval(cambiarImagen, intervalo);
});