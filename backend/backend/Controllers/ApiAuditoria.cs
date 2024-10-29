using Logica;
using Logica.Request;
using Logica.Response;
using Microsoft.AspNetCore.Mvc;
using Request;
using Response;

namespace Api.Controllers
{
    public class ApiAuditoria : ControllerBase
    {
        private readonly Auditoria _auditoria;

        public ApiAuditoria(IConfiguration configuration)
        {
            _auditoria = new Auditoria(configuration.GetConnectionString("DefaultConnection"));
        }

        [HttpPost("obtener")]
        public ActionResult<ResObtenerAuditoria> ObtenerAuditoria([FromBody] ReqObtenerAuditoria req)
        {
            return _auditoria.ObtenerAuditoria(req);
        }

        [HttpPost("activar")]
        public ActionResult<ResActivarAuditoria> ActivarAuditoria([FromBody] ReqActivarAuditoria req)
        {
            return _auditoria.ActivarAuditoria(req);
        }
    }
}