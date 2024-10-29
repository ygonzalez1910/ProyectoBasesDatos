using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Request
{
    public class ReqCreateTableSpace
    {
        public string TableSpaceName { get; set; }
        public string DataFileName { get; set; }
        public int InitialSizeMB { get; set; }
        public int AutoExtendSizeMB { get; set; }
        public int MaxSizeMB { get; set; }
        public string UserPassword { get; set; }
    }
}
