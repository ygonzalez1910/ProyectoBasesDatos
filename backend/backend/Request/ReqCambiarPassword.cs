using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Request
{
    public class ReqCambiarPassword
    {
        public string nombreUsuario { get; set; }
        public string nuevoPassword { get; set; }
    }


}