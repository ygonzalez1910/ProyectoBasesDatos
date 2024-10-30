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
    public class ApiTuning : ControllerBase
    {
        
        private readonly Tuning _tuning;

        public ApiTuning(Tuning tuning)
        {
            _tuning = tuning;
        }


        [HttpPost]
        [Route("analizarConsulta")]
        public IActionResult analizarConsulta([FromBody] ReqAnalisisConsulta req)
        {
            ResAnalisisConsulta res = _tuning.AnalizarConsulta(req);
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
        [Route("obtenerEstadisticasTabla/{schema}/{tabla}")]
        public IActionResult obtenerEstadisticasTabla(string schema, string tabla)
        {
            ResAnalisisConsulta res = _tuning.ObtenerEstadisticasTabla(schema, tabla);
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
        [Route("obtenerTablasPorSchema/{schema}")]
        public IActionResult obtenerTablasPorSchema(string schema)
        {
            var request = new ReqTablasPorSchema
            {
                Schema = schema
            };

            ResTablasPorSchema res = _tuning.ObtenerTablasPorSchema(request);
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