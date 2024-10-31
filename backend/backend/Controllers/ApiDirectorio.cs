using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Logica;
using Request;
using Response;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiDirectorio : ControllerBase
    {
        private readonly Directorio _directorio;
        public ApiDirectorio(Directorio directorio)
        {
            _directorio = directorio;
        }

        [HttpPost("crear")]
        public IActionResult CrearDirectorio([FromBody] ReqCrearDirectorio req)
        {
            if (req == null || string.IsNullOrEmpty(req.directorio) || string.IsNullOrEmpty(req.nombreDirectorio))
            {
                return BadRequest(new CrearDirectorioResponse
                {
                    Success = false,
                    Message = "Datos inválidos."
                });
            }

            var response = _directorio.CrearDirectorio(req);
            if (response.Success)
            {
                return Ok(response);
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        // Cambiando el método para aceptar el nombre del directorio en la ruta
        [HttpDelete("{nombreDirectorio}")]
        public IActionResult EliminarDirectorio(string nombreDirectorio)
        {
            if (string.IsNullOrEmpty(nombreDirectorio))
            {
                return BadRequest("Datos inválidos.");
            }

            try
            {
                var response = _directorio.EliminarDirectorio(nombreDirectorio);
                return Ok(new { success = true, message = "Directorio eliminado exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocurrió un error al procesar la solicitud.");
            }
        }
    }
}
