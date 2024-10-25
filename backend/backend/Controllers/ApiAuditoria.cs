using Microsoft.AspNetCore.Mvc;
using Logica;
using Request;
using Response;

[ApiController]
[Route("api/[controller]")]
public class ApiAuditoria : ControllerBase
{
    private readonly Auditoria _auditoria;

    public ApiAuditoria(Auditoria auditoria)
    {
        _auditoria = auditoria;
    }

    // Endpoint para registrar una auditoría de tipo INSERT
    [HttpPost]
    [Route("auditarInsert")]
    public IActionResult AuditarInsert([FromBody] ReqConfigurarAuditoria req)
    {
        var res = _auditoria.AuditarInsert(req);
        if (res.resultado)
        {
            return Ok(res);
        }
        else
        {
            return BadRequest(res);
        }
    }

    // Endpoint para registrar una auditoría de tipo UPDATE
    [HttpPost]
    [Route("auditarUpdate")]
    public IActionResult AuditarUpdate([FromBody] ReqConfigurarAuditoria req)
    {
        var res = _auditoria.AuditarUpdate(req);
        if (res.resultado)
        {
            return Ok(res);
        }
        else
        {
            return BadRequest(res);
        }
    }

    // Endpoint para registrar una auditoría de tipo DELETE
    [HttpPost]
    [Route("auditarDelete")]
    public IActionResult AuditarDelete([FromBody] ReqConfigurarAuditoria req)
    {
        var res = _auditoria.AuditarDelete(req);
        if (res.resultado)
        {
            return Ok(res);
        }
        else
        {
            return BadRequest(res);
        }
    }

    // Endpoint para registrar una auditoría de tipo SELECT
    [HttpPost]
    [Route("auditarSelect")]
    public IActionResult AuditarSelect([FromBody] ReqConfigurarAuditoria req)
    {
        var res = _auditoria.AuditarSelect(req);
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
