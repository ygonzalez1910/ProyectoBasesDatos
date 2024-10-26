using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Response
{
    public class ResGetTables
    {
        public List<TableModel> Tables { get; set; } = new List<TableModel>();
        public List<string> Errores { get; set; } = new List<string>();
    }
}
