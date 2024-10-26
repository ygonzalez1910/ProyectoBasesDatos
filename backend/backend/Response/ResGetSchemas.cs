using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Response
{
    public class ResGetSchemas
    {
        public List<SchemaModel> Schemas { get; set; }
        public List<string> Errores { get; set; }

        public ResGetSchemas()
        {
            Schemas = new List<SchemaModel>();
            Errores = new List<string>();
        }
    }
}
