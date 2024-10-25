namespace Request
{

    public class ReqConfigurarAuditoriaSchema
    {
        public string Schema { get; set; }
        public string ModoAuditoria { get; set; } // Ejemplo: "SESSION" o "ACCESS"
    }
}