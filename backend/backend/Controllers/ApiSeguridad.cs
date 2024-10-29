using Logica;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Request;
using Response;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiSeguridad : ControllerBase
    {
        private readonly Seguridad _seguridad;

        public ApiSeguridad(Seguridad seguridad)
        {
            _seguridad = seguridad;
        }

        [HttpPost("crearUsuario")]
        public IActionResult CrearUsuario([FromBody] ReqCrearUsuario req)
        {
            if (req == null)
            {
                return BadRequest("El cuerpo de la solicitud no puede ser nulo.");
            }

            var res = _seguridad.CrearUsuario(req);
            return res.resultado ? Ok(res) : BadRequest(res);
        }

        [HttpDelete("eliminarUsuario")]
        public IActionResult EliminarUsuario([FromBody] ReqEliminarUsuario req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.nombreUsuario))
            {
                return BadRequest("El cuerpo de la solicitud no puede ser nulo y el nombre de usuario es obligatorio.");
            }

            var res = _seguridad.EliminarUsuario(req);
            return res.resultado ? Ok(res) : BadRequest(res);
        }


        [HttpPut("cambiarPassword")]
        public IActionResult CambiarPassword([FromBody] ReqCambiarPassword req)
        {
            var res = _seguridad.CambiarPassword(req);
            return res.resultado ? Ok(res) : BadRequest(res);
        }

        [HttpPost("crearRol")]
        public IActionResult CrearRol([FromBody] ReqCrearRol req)
        {
            var res = _seguridad.CrearRol(req);
            return res.resultado ? Ok(res) : BadRequest(res);
        }

        [HttpGet("listarPrivilegios")]
        public IActionResult ListarPrivilegios([FromQuery] ReqListarPrivilegios req)
        {
            var res = _seguridad.ListarPrivilegios(req);
            return res.resultado ? Ok(res) : BadRequest(res);
        }
        [HttpGet]
        [Route("listarRoles")]
        public IActionResult ListarRoles()
        {
            ResListarRoles res = _seguridad.ListarRoles();
            if (res.resultado)
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
