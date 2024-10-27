using Logica;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Request;
using Response;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiSchema : ControllerBase
    {
        private readonly Schema _schemaService;

        public ApiSchema(Schema schemaService)
        {
            _schemaService = schemaService;
        }

        [HttpGet("get-schemas")]
        public ActionResult<ResGetSchemas> GetSchemas()
        {
            var result = _schemaService.GetSchemas();
            if (result.Errores.Count > 0)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
        [HttpGet("get-tables")]
        public ActionResult<ResGetTables> GetTables()
        {
            var result = _schemaService.GetTables();
            if (result.Errores.Count > 0)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("backup/{tipo}")]
        public IActionResult ObtenerNombresBackupPorTipo(string tipo)
        {
            if (string.IsNullOrEmpty(tipo))
            {
                return BadRequest("El tipo de respaldo es obligatorio.");
            }

            var req = new ReqTipoBackup { TipoBackup = tipo };
            ResNombresBackup res = _schemaService.ObtenerNombresBackupPorTipo(req);

            if (!res.Resultado)
            {
                return BadRequest(res.Errores);
            }

            return Ok(res);
        }
    }
}
