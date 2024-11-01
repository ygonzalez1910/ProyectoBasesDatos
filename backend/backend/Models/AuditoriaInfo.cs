namespace Models
{
    public class AuditoriaInfo
    {
        public long AuditoriaId { get; set; }
        public DateTime FechaHora { get; set; }
        public string Usuario { get; set; }
        public string TipoAccion { get; set; }
        public string NombreTabla { get; set; }
        public string Esquema { get; set; }
        public string ConsultaSQL { get; set; }
        public string SesionId { get; set; }
        public string UsuarioOS { get; set; }
        public string HostUsuario { get; set; }
        public string Terminal { get; set; }
    }
}