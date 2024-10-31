using Microsoft.AspNetCore.Mvc;
using Logica;
using Request;
using Response;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiPerformance : ControllerBase
    {
        private readonly Performance _performance;

        public ApiPerformance(Performance performance)
        {
            _performance = performance;
        }

        [HttpPost]
        [Route("crear-indice")]
        public IActionResult CrearIndice([FromBody] ReqCrearIndice req)
        {
            ResCrearIndice res = _performance.CrearIndice(req);
            if (res.Resultado) // Cambia resultado por Resultado
            {
                return Ok(res);
            }
            else
            {
                return BadRequest(res);
            }
        }


        [HttpPost]
        [Route("eliminar-indice")]
        public IActionResult EliminarIndice([FromBody] ReqEliminarIndice req)
        {
            ResEliminarIndice res = _performance.EliminarIndice(req);
            if (res.resultado)
            {
                return Ok(res);
            }
            else
            {
                return BadRequest(res);
            }
        }

        [HttpPost]
        [Route("listar-indices")]
        public IActionResult ListarIndices([FromBody] ReqListarIndices req)
        {
            ResListarIndices res = _performance.ListarIndices(req);
            if (res.resultado)
            {
                return Ok(res);
            }
            else
            {
                return BadRequest(res);
            }
        }

        [HttpPost]
        [Route("obtener-estadisticas-indice")]
        public IActionResult ObtenerEstadisticasIndice([FromBody] ReqEstadisticasIndice req)
        {
            ResEstadisticasIndice res = _performance.ObtenerEstadisticasIndice(req);
            if (res.resultado)
            {
                return Ok(res);
            }
            else
            {
                return BadRequest(res);
            }
        }

        [HttpGet("ver-todos-los-indices")]
        public IActionResult VerTodosLosIndices()
        {
            ResVerTodosLosIndices res = _performance.VerTodosLosIndices();
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
