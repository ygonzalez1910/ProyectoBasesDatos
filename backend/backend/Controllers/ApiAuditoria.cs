using Microsoft.AspNetCore.Mvc;
using Logica;
using Request;
using Response;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiAuditoria : ControllerBase
    {
        private readonly Auditoria _auditoria;

        public ApiAuditoria(Auditoria auditoria)
        {
            _auditoria = auditoria;
        }

        [HttpPost]
        [Route("obtener")]
        public IActionResult ObtenerAuditoria([FromBody] ReqObtenerAuditoria req)
        {
            ResObtenerAuditoria res = _auditoria.ObtenerAuditoria(req);
            if (res.Resultado)
            {
                return Ok(res);
            }
            else
            {
                return BadRequest(res);
            }
        }

        [HttpPost]
        [Route("activar")]
        public IActionResult ActivarAuditoria([FromBody] ReqActivarAuditoria req)
        {
            ResActivarAuditoria res = _auditoria.ActivarAuditoria(req);
            if (res.Resultado)
            {
                return Ok(res);
            }
            else
            {
                return BadRequest(res);
            }
        }


        [HttpGet]
        [Route("listar-tablas")]
        public IActionResult ListarTablas()
        {
            ResListarTablas res = _auditoria.ListarTablas();
            if (res.Resultado)
            {
                return Ok(res);
            }
            else
            {
                return BadRequest(res);
            }
        }


    }
}
