using System;
using System.Collections.Generic;

namespace Request
{
    public class ReqCrearIndice
    {
        public string NombreIndice { get; set; }
        public string NombreTabla { get; set; }
        public string NombreSchema { get; set; }
        public List<string> Columnas { get; set; }
        public bool EsUnico { get; set; } // Indica si el índice es único
    }
}
