using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Response
{
    public class ResListarRoles
    {
        public bool resultado { get; set; }
        public List<string> errores { get; set; }
        public List<RolInfo> roles { get; set; }
    }
}