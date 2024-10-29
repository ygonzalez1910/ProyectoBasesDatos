using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Response
{
    public class ResListarTablas
    {
        public List<string> Tablas { get; set; }
        public bool Resultado { get; set; }
        public List<string> Errores { get; set; }

        public ResListarTablas()
        {
            Tablas = new List<string>();
            Errores = new List<string>();
        }
    }
}
