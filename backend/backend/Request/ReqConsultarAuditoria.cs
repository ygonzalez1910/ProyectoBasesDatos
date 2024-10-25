namespace Request
{
    public class ReqConsultarAuditoria
    {
        public string Schema { get; set; }
        public string Tabla { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string Usuario { get; set; }
    }
}
