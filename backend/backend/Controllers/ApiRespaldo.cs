using Microsoft.AspNetCore.Mvc;
using Logica;
using Request;
using Response;

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
    }
}
