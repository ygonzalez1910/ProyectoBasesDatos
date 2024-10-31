using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Request
{
    public class ReqObtenerAuditoria
    {
        public string NombreTabla { get; set; }
        public string Esquema { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string? TipoAccion { get; set; }  // INSERT, UPDATE, DELETE, SELECT
    }
}
