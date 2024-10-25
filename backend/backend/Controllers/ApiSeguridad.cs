using Microsoft.AspNetCore.Mvc;
using Logica;
using Request;
using Response;

[ApiController]
[Route("api/[controller]")]
public class ApiSeguridad : ControllerBase
{
    private readonly Seguridad _seguridad;

    public ApiSeguridad(Seguridad seguridad)
    {
        _seguridad = seguridad;
    }

    [HttpPost]
    [Route("api/seguridad/crearUsuario")]
    public IActionResult CrearUsuario([FromBody] ReqCrearUsuarios req)
    {
        var res = _seguridad.CrearUsuario(req);
        if (res.resultado)
        {
            return Ok(res);
        }
        else
        {
            return BadRequest(res);
        }
    }

    [HttpDelete]
    [Route("api/seguridad/eliminarUsuario")]
    public IActionResult EliminarUsuario([FromBody] ReqEliminarUsuario req)
    {
        var res = _seguridad.EliminarUsuario(req);
        if (res.resultado)
        {
            return Ok(res);
        }
        else
        {
            return BadRequest(res);
        }
    }

    [HttpPut]
    [Route("api/seguridad/cambiarPassword")]
    public IActionResult CambiarPassword([FromBody] ReqCambiarPassword req)
    {
        var res = _seguridad.CambiarPassword(req);
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
    [Route("api/seguridad/crearRol")]
    public IActionResult CrearRol([FromBody] ReqCrearRol req)
    {
        var res = _seguridad.CrearRol(req);
        if (res.resultado)
        {
            return Ok(res);
        }
        else
        {
            return BadRequest(res);
        }
    }

    [HttpGet]
    [Route("api/seguridad/listarPrivilegios")]
    public IActionResult ListarPrivilegios([FromQuery] ReqListarPrivilegios req)
    {
        var res = _seguridad.ListarPrivilegios(req);
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