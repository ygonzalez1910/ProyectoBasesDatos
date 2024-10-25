using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Response
{
    public class ResVerificarConfiguracionAuditoria
    {
        public bool Resultado { get; set; }
        public List<string> Errores { get; set; }
        public List<ConfiguracionAuditoria> Configuraciones { get; set; }
    }
}