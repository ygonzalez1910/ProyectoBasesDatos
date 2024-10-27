using Microsoft.AspNetCore.Mvc;
using Logica;
using Request;
using Response;
using Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiRespaldo : ControllerBase
    {
        private readonly Respaldo _respaldo;

        public ApiRespaldo(Respaldo respaldo)
        {
            _respaldo = respaldo;
        }

        [HttpPost]
        [Route("schema")]
        public IActionResult RespaldoSchema([FromBody] ReqRespaldoSchema req)
        {
            if (req == null)
            {
                return BadRequest("La solicitud no puede ser nula.");
            }

            // Llamar al método de respaldo de esquema y obtener la respuesta
            ResRespaldoSchema res = _respaldo.RespaldarSchema(req);

            if (res.resultado)
            {
                return Ok("Respaldo realizado con éxito.");
            }
            else
            {
                return BadRequest(res.errores);
            }
        }

        [HttpPost]
        [Route("tabla")]
        public IActionResult RespaldoTabla([FromBody] ReqRespaldoTabla req)
        {
            var resultado = _respaldo.RespaldarTabla(req);

            if (resultado.resultado)
            {
                return Ok(resultado);
            }
            return BadRequest(resultado);
        }

        [HttpPost]
        [Route("completo")]
        public ActionResult<ResRespaldoCompleto> RespaldarBaseDeDatos([FromBody] ReqRespaldoCompleto req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.contrasena) || string.IsNullOrWhiteSpace(req.directorio))
            {
                return BadRequest("Los parámetros de entrada no son válidos.");
            }

            var resultado = _respaldo.RespaldarBaseDeDatos(req);

            if (resultado.resultado)
            {
                return Ok(resultado);
            }
            else
            {
                return StatusCode(500, resultado);
            }
        }

        [HttpGet]
        public ActionResult<RespuestaDirectorios> ObtenerDirectorios()
        {
            var resultado = _respaldo.ObtenerDirectorios();

            if (resultado.Errores.Count > 0)
            {
                return BadRequest(resultado.Errores);
            }

            return Ok(resultado);
        }

        [HttpPost]
        [Route("recuperar")]
        public IActionResult RecuperarRespaldo([FromBody] ReqRecuperarRespaldo req)
        {
            if (req == null || string.IsNullOrEmpty(req.TipoBackup) || string.IsNullOrEmpty(req.NombreBackup) || string.IsNullOrEmpty(req.Contrasena))
            {
                return BadRequest("Todos los campos son obligatorios.");
            }

            var res = _respaldo.RecuperarRespaldo(req);

            if (!res.Resultado)
            {
                return BadRequest(res.Errores);
            }

            return Ok(res);
        }
    }
}
