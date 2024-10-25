
namespace Request
{

    public class ReqConfigurarAuditoria
    {
        public string Schema { get; set; }
        public string NombreTabla { get; set; }
        public bool AuditarInsert { get; set; }  // Aquí debe estar definida
        public bool AuditarUpdate { get; set; }
        public bool AuditarDelete { get; set; }
        public bool AuditarSelect { get; set; }
        public string ModoAuditoria { get; set; }
    }

}