namespace Models
{
    public class AuditoriaInfo
    {
        public int AuditoriaId { get; set; }
        public string NombreTabla { get; set; }
        public string TipoAccion { get; set; }
        public DateTime FechaHora { get; set; }
        public string Usuario { get; set; }
        public string SesionId { get; set; }
        public string Esquema { get; set; }
        public string ConsultaSQL { get; set; }
    }
}