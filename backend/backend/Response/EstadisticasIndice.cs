using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Response
{
    public class EstadisticasIndice
    {
        public string NombreIndice { get; set; }
        public int Altura { get; set; }
        public int Bloques { get; set; }
        public int BloquesHoja { get; set; }
        public int ClavesDistintas { get; set; }
        public decimal PromBloquesHojaPorClave { get; set; }
        public decimal PromBloquesDatosPorClave { get; set; }

    }
}