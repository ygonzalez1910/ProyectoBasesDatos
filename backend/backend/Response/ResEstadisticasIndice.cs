using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Response
{
    public class ResEstadisticasIndice
    {
        public bool resultado { get; set; }
        public bool Exito { get; set; }
        public string Mensaje { get; set; }
        public EstadisticasIndice Estadisticas { get; set; } // Detalles del índice
        public List<string> Errores { get; set; } // Para errores en las estadísticas
    }
}
