namespace Models
{
    public class RespuestaDirectorios
    {
        public List<ModelDirectorio> Directorios { get; set; } = new List<ModelDirectorio>();
        public List<string> Errores { get; set; } = new List<string>();
    }
}
