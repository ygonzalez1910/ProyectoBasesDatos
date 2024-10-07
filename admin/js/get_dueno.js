document.querySelectorAll(".open-modal").forEach(function (element) {
    element.addEventListener("click", function (event) {
        event.preventDefault();
        const idDueno = this.getAttribute("data-id-dueno");

        fetch(`../php/get_dueno.php?id_dueno=${idDueno}`)
            .then(response => response.text())
            .then(data => {
                document.querySelector("#modal-content").innerHTML = data;
                document.querySelector("#modal").showModal();
                document.querySelector("#blur-background").style.display = "block"; // Mostrar el fondo desenfocado
            })
            .catch(error => console.error('Error al cargar los datos:', error));
    });
});

// Cerrar el modal y ocultar el fondo desenfocado
document.querySelector("#modal").addEventListener("close", function () {
    document.querySelector("#blur-background").style.display = "none"; // Ocultar el fondo desenfocado
});