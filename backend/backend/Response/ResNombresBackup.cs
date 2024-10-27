using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Response
{
    public class ResNombresBackup
    {
        public List<string> NombresBackup { get; set; }
        public bool Resultado { get; set; }
        public List<string> Errores { get; set; }

        public ResNombresBackup()
        {
            NombresBackup = new List<string>();
            Errores = new List<string>();
        }
    }
}
