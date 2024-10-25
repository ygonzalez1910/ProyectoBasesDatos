using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Request
{
    public class ReqAsignarPrivilegios
    {
        public string nombreUsuario { get; set; }
        public string tipoPrivilegio { get; set; }  // SELECT, INSERT, UPDATE, DELETE, EXECUTE
        public string schema { get; set; }
        public string objeto { get; set; }
    }


}