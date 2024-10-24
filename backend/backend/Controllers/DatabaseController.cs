using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatabaseController : ControllerBase
    {
        private readonly OracleDbService _oracleDbService;

        public DatabaseController(OracleDbService oracleDbService)
        {
            _oracleDbService = oracleDbService;
        }

        [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                bool isConnected = await _oracleDbService.TestConnectionAsync();
                if (isConnected)
                {
                    return Ok("Conexión exitosa a Oracle");
                }
                else
                {
                    // Agregamos un log para ver el error específico
                    var message = HttpContext.Items["ErrorMessage"]?.ToString() ?? "Error desconocido";
                    return StatusCode(500, $"Error de Conexión a Oracle: {message}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado: {ex.Message}");
            }
        }
    }
}
