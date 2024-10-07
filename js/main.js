function sortearGrupos() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "procesos/realizarSorteo.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseText == "Error: falta ingresar equipos.") {
                // Maneja el caso de que falten equipos
                document.getElementById("mensaje").innerText = xhr.responseText;
                document.getElementById("mensaje").style.color = "#dc3545";
            } else if (xhr.responseText != "Deshabilitar") {
                // Cuando la solicitud se complete, muestra un mensaje en la página.
                document.getElementById("mensaje").innerText = ""/*xhr.responseText*/;
                mostrarSorteo();
            } else {
            // Deshabilitar botón.
            document.getElementById('sortearBtn').disabled = true;
            document.getElementById("mensaje").innerText = "Error: los grupos ya fueron sorteados.";
            }
        }
    };
    xhr.send();
}

document.addEventListener("DOMContentLoaded", function(event) {
    if (document.body.getAttribute("data-carga") === "cargaSorteo") {
        mostrarSorteo();
    }
});

function mostrarSorteo() {
    // Realiza una solicitud AJAX para obtener el resultado del sorteo
    $.ajax({
        url: 'procesos/mostrarSorteo.php',
        type: 'GET',
        success: function(response) {
            // Muestra la respuesta en el contenedor adecuado
            $('#mostrarGrupos').html(response);
            //console.log(response);
            if (response != '') {
                document.getElementById('sortearBtn').style.display = 'none';
                document.getElementById("pa-sg").classList.toggle("active");
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar el sorteo:', error);
        }
    });
}

const mensajeExito = '¡Mensaje enviado correctamente!';
const mensajeError = 'Error al enviar el mensaje.';

function responderForm() {
    // Obtener los valores del formulario
    var nombre = document.querySelector('input[name="nombre"]').value.trim();
    var email = document.querySelector('input[name="email"]').value.trim();
    var mensaje = document.querySelector('textarea[name="mensaje"]').value.trim();

    // Validar el formato del correo electrónico
    var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Validar que los campos no estén vacíos
    if (nombre === '' || email === '' || mensaje === '') {
        mostrarMensaje('Todos los campos son obligatorios.', 'error');
        // Ocultar el mensaje después de 3 segundos
        setTimeout(function() {
            ocultarMensaje();
        }, 2000);
    } else if (!emailValido) {
        mostrarMensaje('El correo electrónico ingresado no es válido.', 'error');
        // Ocultar el mensaje después de 3 segundos
        setTimeout(function() {
            ocultarMensaje();
        }, 2000);
    } else if (!validarNombre(nombre)) {
        mostrarMensaje('El nombre no es válido.', 'error');
        // Ocultar el mensaje después de 3 segundos
        setTimeout(function() {
            ocultarMensaje();
        }, 2000);   
    }
    else {

        limpiarFormulario();

        // Simulamos una respuesta exitosa para este ejemplo
        var exito = true;
        mostrarMensaje(exito ? mensajeExito : mensajeError  , exito ? 'success' : 'error');

        // Ocultar el mensaje después de 3 segundos
        setTimeout(function() {
            ocultarMensaje();
        }, 2000);
    }
}

function mostrarMensaje(mensaje, tipo) {
    const respuestaForm = document.querySelector('.respuestaForm');
    respuestaForm.style.display = 'block';
    respuestaForm.style.color = '#fff';
    respuestaForm.textContent = mensaje;
    respuestaForm.className = 'respuestaForm ' + tipo;
}

function validarNombre(nombre) {
    // Verificar que el nombre tenga al menos 2 caracteres y no contenga números
    return nombre.length >= 2 && !/\d/.test(nombre);
}

function ocultarMensaje() {
    const respuestaForm = document.querySelector('.respuestaForm');
    respuestaForm.style.display = 'none';
}

function limpiarFormulario() {
    document.querySelector('input[name="nombre"]').value = '';
    document.querySelector('input[name="email"]').value = '';
    document.querySelector('textarea[name="mensaje"]').value = '';
}