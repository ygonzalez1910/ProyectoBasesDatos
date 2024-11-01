namespace Models
{
    public class UsuarioInfo
    {
        public string nombreUsuario { get; set; }
        public string estado { get; set; }  // OPEN/LOCKED
        public string fechaCreacion { get; set; }
        public string perfilPorDefecto { get; set; }
        public string autenticacion { get; set; }
        public string comun { get; set; }  // YES/NO for common users
    }
}