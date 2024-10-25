using System.Collections.Generic;

namespace Response
{
    public class ResAuditoria
    {
        // Indica si la operación fue exitosa o no
        public bool resultado { get; set; }

        // Lista de errores si los hubiera
        public List<string> errores { get; set; }

        // Información adicional sobre la operación
        public string mensaje { get; set; }

        public ResAuditoria()
        {
            // Inicializar la lista de errores
            errores = new List<string>();
        }
    }
}
