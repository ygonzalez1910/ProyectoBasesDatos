namespace Models
{
    public class RespuestaDirectorios
    {
        public List<Directorio> Directorios { get; set; } = new List<Directorio>();
        public List<string> Errores { get; set; } = new List<string>();
    }
}
