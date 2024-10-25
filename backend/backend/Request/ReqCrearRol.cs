using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Request
{
    public class ReqCrearRol
    {
        public string nombreRol { get; set; }
        public string password { get; set; }
        public string schema { get; set; }
        public string package { get; set; }
        public bool esRolExterno { get; set; }
    }


}