using System.Collections.Generic;
using Models;

namespace Response
{
    public class ResListarUsuarios
    {
        public bool resultado { get; set; }
        public List<string> errores { get; set; }
        public List<UsuarioInfo> usuarios { get; set; }
    }
}
