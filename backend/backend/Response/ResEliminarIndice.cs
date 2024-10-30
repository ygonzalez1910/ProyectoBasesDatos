using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Response
{
    public class ResEliminarIndice
    {
        public bool resultado { get; set; }
        public bool Exito { get; set; }
        public string Mensaje { get; set; }
        public List<string> Errores { get; set; } // Para errores específicos de eliminación
    }
}
