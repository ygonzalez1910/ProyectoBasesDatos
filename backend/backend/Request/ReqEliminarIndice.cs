using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Request
{
    public class ReqEliminarIndice
    {
        public string NombreTabla { get; set; } // Nombre de la tabla donde se eliminará el índice
        public string NombreIndice { get; set; } // Nombre del índice a eliminar
    }

}
