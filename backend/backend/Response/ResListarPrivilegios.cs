using Models;

namespace Response
{
    public class ResListarPrivilegios
    {
        public bool resultado { get; set; }
        public List<string> errores { get; set; }
        public List<PrivilegioInfo> privilegios { get; set; }
    }
}