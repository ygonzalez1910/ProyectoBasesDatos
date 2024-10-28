using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Response
{
    public class ResListaTablas
    {
        public List<string> Tablas { get; set; }
        public bool Resultado { get; set; }
        public List<string> Errores { get; set; }
    }
}
