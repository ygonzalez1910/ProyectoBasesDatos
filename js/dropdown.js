// Obtener el elemento del botón del menú
var menuBtn = document.querySelector('.menu');

// Obtener el elemento del contenido del dropdown
var dropdownContent = document.querySelector('.dropdown-content');

// Obtener todos los enlaces dentro del menú desplegable
var dropdownLinks = document.querySelectorAll('.dropdown-content a');

// Agregar un evento de clic a cada enlace dentro del menú desplegable
dropdownLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
        // Prevenir el comportamiento predeterminado del enlace
        event.preventDefault();

        // Cerrar el menú desplegable
        dropdownContent.classList.remove('show');
        menuBtn.classList.remove('open');
        
        // Redirigir al enlace
        window.location.href = link.href;
    });
});

// Agregar un evento de clic al botón del menú para alternar la visibilidad del dropdown
menuBtn.addEventListener('click', function(event) {
    // Prevenir el comportamiento predeterminado del enlace
    event.preventDefault();
    
    // Alternar la clase 'show' para mostrar u ocultar el menú desplegable
    dropdownContent.classList.toggle('show');

    // Alternar la clase 'open' para rotar el icono del menú
    menuBtn.classList.toggle('open');
});


// Cerrar el dropdown cuando se haga clic fuera de él
window.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
        dropdownContent.classList.remove('show');
        menuBtn.classList.remove('open'); // Asegúrate de quitar la clase 'open' cuando se cierra el menú
    }
});
