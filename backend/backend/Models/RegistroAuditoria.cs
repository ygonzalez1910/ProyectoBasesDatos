namespace Models
{
    public class RegistroAuditoria
    {
        public DateTime Fecha { get; set; }
        public string Usuario { get; set; }
        public string Operacion { get; set; }
        public string Objeto { get; set; }
        public string Detalles { get; set; }
    }
}