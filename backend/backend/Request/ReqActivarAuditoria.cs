using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Request
{
    public class ReqActivarAuditoria
    {
        public string NombreTabla { get; set; }
        public bool AuditarInsert { get; set; }
        public bool AuditarUpdate { get; set; }
        public bool AuditarDelete { get; set; }
        public bool AuditarSelect { get; set; }
    }
}
