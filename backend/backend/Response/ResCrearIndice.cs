using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Response
{
    public class ResCrearIndice
    {
        public bool Resultado { get; set; } // Debes corregir el nombre de la propiedad
        public bool Exito { get; set; }
        public string Mensaje { get; set; }
        public List<string> Errores { get; set; } // Para errores específicos de creación

        public ResCrearIndice()
        {
            Errores = new List<string>();
        }
    }

}
