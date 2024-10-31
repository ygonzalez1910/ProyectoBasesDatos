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
                return BadRequest("Datos inválidos.");
            }

            try
            {
                if (_directorio.CrearDirectorio(req))
                {
                    return Ok("Directorio creado exitosamente.");
                }
                else
                {
                    return StatusCode(500, "Error al crear el directorio.");
                }
            }
            catch (Exception ex)
            {   
                return StatusCode(500, "Ocurrió un error al procesar la solicitud.");
            }
        }
        [HttpDelete("eliminar")]
        public IActionResult EliminarDirectorio([FromBody] ReqEliminarDirectorio req)
        {
            if (req == null || string.IsNullOrEmpty(req.nombreDirectorio))
            {
                return BadRequest("Datos inválidos.");
            }

            try
            {
                if (_directorio.EliminarDirectorio(req.nombreDirectorio))
                {
                    return Ok("Directorio eliminado exitosamente.");
                }
                else
                {
                    return StatusCode(500, "Error al eliminar el directorio.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocurrió un error al procesar la solicitud.");
            }
        }

    }
}
