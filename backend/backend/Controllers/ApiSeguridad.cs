using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Logica;
using Request;
using Response;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiSeguridad : ControllerBase
    {
        private readonly Seguridad _seguridadService;

        public ApiSeguridad(Seguridad seguridadService)
        {
            _seguridadService = seguridadService;
        }

        [HttpPost("crear-usuario")]
        public ActionResult<ResCrearUsuario> CrearUsuario([FromBody] ReqCrearUsuario request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _seguridadService.CrearUsuario(request);
            if (result.errores.Count > 0)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("modificar-usuario")]
        public ActionResult<ResModificarUsuario> ModificarUsuario([FromBody] ReqModificarUsuario request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _seguridadService.ModificarUsuario(request);
            if (result.errores.Count > 0)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpDelete("eliminar-usuario")]
        public ActionResult<ResEliminarUsuario> EliminarUsuario([FromBody] ReqEliminarUsuario request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _seguridadService.EliminarUsuario(request);
            if (result.errores.Count > 0)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("cambiar-password")]
        public ActionResult<ResCambiarPassword> CambiarPassword([FromBody] ReqCambiarPassword request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _seguridadService.CambiarPassword(request);
            if (result.errores.Count > 0)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("crear-rol")]
        public ActionResult<ResCrearRol> CrearRol([FromBody] ReqCrearRol request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _seguridadService.CrearRol(request);
            if (result.errores.Count > 0)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("listar-privilegios")]
        public ActionResult<ResListarPrivilegios> ListarPrivilegios([FromQuery] ReqListarPrivilegios request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = _seguridadService.ListarPrivilegios(request);
            if (result.errores.Count > 0)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("listar-roles")]
        public ActionResult<ResListarRoles> ListarRoles()
        {
            var result = _seguridadService.ListarRoles();
            if (result.errores.Count > 0)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("listar-usuarios")]
        public ActionResult<ResListarUsuarios> ListarUsuarios([FromQuery] ReqListarUsuarios request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = _seguridadService.ListarUsuarios(request);
            if (result.errores.Count > 0)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}