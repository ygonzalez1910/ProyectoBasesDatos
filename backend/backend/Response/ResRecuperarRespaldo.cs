using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Response
{
    public class ResRecuperarRespaldo
    {
        public bool Resultado { get; set; }
        public List<string> Errores { get; set; }

        public ResRecuperarRespaldo()
        {
            Errores = new List<string>();
        }
    }
}
