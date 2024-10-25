using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Response
{
    public class ResConsultarAuditoria
    {
        public bool Resultado { get; set; }
        public List<string> Errores { get; set; }
        public List<RegistroAuditoria> Registros { get; set; }
    }
}