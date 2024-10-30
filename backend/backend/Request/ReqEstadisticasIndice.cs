using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Request
{
    public class ReqEstadisticasIndice
    {
        public string NombreTabla { get; set; } // Nombre de la tabla del índice
        public string NombreIndice { get; set; } // Nombre del índice para obtener estadísticas
    }

}
