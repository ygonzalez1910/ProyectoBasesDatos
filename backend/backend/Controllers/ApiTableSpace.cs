using backend.Services;
using Logica;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Request;
using Response;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiTableSpace : ControllerBase
    {
        private readonly TableSpace _tableSpaceService;

        public ApiTableSpace(TableSpace tableSpaceService)
        {
            _tableSpaceService = tableSpaceService;
        }

        [HttpGet("get-tablespaces")]
        public ActionResult<ResGetTableSpaces> GetTableSpaces()
        {
            var result = _tableSpaceService.GetTableSpaces();
            if (result.Errores.Count > 0)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpDelete("{tablespaceName}")]
        public async Task<IActionResult> DeleteTablespace(string tablespaceName)
        {
            // Crear la solicitud para pasarla a DeleteTableSpace
            var request = new ReqDeleteTableSpace { TableSpaceName = tablespaceName };

            try
            {
                // Ejecutar la llamada de forma asíncrona usando Task.Run
                var result = await Task.Run(() => _tableSpaceService.DeleteTableSpace(request));

                if (result.Exito)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("modify-tablespace-size")]
        public IActionResult ModifyTableSpaceSize([FromBody] ReqModifyTableSpaceSize request)
        {
            var result = _tableSpaceService.ModifyTableSpaceSize(request);

            if (result.Exito)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpPost("create-tablespace")]
        public ActionResult<ResCreateTableSpace> CreateTableSpace([FromBody] ReqCreateTableSpace request)
        {
            if (request == null || string.IsNullOrEmpty(request.TableSpaceName))
            {
                return BadRequest("Request no válida.");
            }

            var result = _tableSpaceService.CreateTableSpace(request);
            if (!result.Exito)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
