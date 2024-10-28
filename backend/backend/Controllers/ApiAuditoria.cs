using Logica;
using Logica.Request;
using Logica.Response;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class ApiAuditoria : ControllerBase
    {
        private readonly Auditoria _auditoria;

        public ApiAuditoria(Auditoria auditoria)
        {
            _auditoria = auditoria;
        }

        [HttpGet]
        [Route("api/auditoria/estado")]
        public IActionResult ObtenerEstadoAuditoria()
        {
            var res = _auditoria.ObtenerEstadoAuditoria();
            if (res.Exitoso)
            {
                return Ok(res);
            }
            return BadRequest(res);
        }

        [HttpPost]
        [Route("api/auditoria/configurar/conexiones")]
        public IActionResult ConfigurarAuditoriaConexiones([FromBody] ReqAuditoria req)
        {
            var res = _auditoria.ConfigurarAuditoriaConexiones(req);
            if (res.Exitoso)
            {
                return Ok(res);
            }
            return BadRequest(res);
        }

        [HttpPost]
        [Route("api/auditoria/configurar/tablas")]
        public IActionResult ConfigurarAuditoriaTablas([FromBody] List<ReqAuditoriaTablas> req)
        {
            var res = _auditoria.ConfigurarAuditoriaTablas(req);
            if (res.Exitoso)
            {
                return Ok(res);
            }
            return BadRequest(res);
        }

        [HttpPost]
        [Route("api/auditoria/configurar/acciones")]
        public IActionResult ConfigurarAuditoriaAcciones([FromBody] ReqAuditoriaAcciones req)
        {
            var res = _auditoria.ConfigurarAuditoriaAcciones(req);
            if (res.Exitoso)
            {
                return Ok(res);
            }
            return BadRequest(res);
        }

        [HttpPost]
        [Route("api/auditoria/consultar")]
        public IActionResult ConsultarRegistrosAuditoria([FromBody] ReqAuditoria req)
        {
            var res = _auditoria.ConsultarRegistrosAuditoria(req);
            if (res.Exitoso)
            {
                return Ok(res);
            }
            return BadRequest(res);
        }

        [HttpGet]
        [Route("api/auditoria/resumen")]
        public IActionResult ConsultarResumenAuditoria()
        {
            var res = _auditoria.ConsultarResumenAuditoria();
            if (res.Exitoso)
            {
                return Ok(res);
            }
            return BadRequest(res);
        }
    }
}