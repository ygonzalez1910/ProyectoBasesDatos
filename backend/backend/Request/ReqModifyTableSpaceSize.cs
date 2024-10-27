using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Request
{
    public class ReqModifyTableSpaceSize
    {
        public string TableSpaceName { get; set; }
        public decimal NewSizeMB { get; set; }
    }
}
