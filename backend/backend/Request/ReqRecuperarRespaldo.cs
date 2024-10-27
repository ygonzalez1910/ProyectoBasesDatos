using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Request
{
    public class ReqRecuperarRespaldo
    {
        public string TipoBackup { get; set; }  // Puede ser "table", "schema" o "full"
        public string NombreBackup { get; set; }
        public string Contrasena { get; set; }
    }
}
