namespace Models
{
    public class ConfiguracionAuditoria
    {
        public string Propietario { get; set; }
        public string NombreObjeto { get; set; }
        public string TipoObjeto { get; set; }
        public bool Insertar { get; set; }
        public bool Actualizar { get; set; }
        public bool Eliminar { get; set; }
        public bool Seleccionar { get; set; }
        public string OpcionAuditoria { get; set; }
    }

}