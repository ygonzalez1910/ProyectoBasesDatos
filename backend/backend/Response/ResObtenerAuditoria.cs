using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models;
namespace Response
{
    public class ResObtenerAuditoria
    {
        public bool Resultado { get; set; }
        public List<string> Errores { get; set; }
        public List<AuditoriaInfo> Registros { get; set; }
    }
}
