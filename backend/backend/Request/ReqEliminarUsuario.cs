using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Request
{
    public class ReqEliminarUsuario
    {
        public string nombreUsuario { get; set; }
        public bool includeCascade { get; set; }
    }

}
