using System.Collections.Generic;

namespace Response
{
    public class ResTablasPorSchema
    {
        public List<string> Tablas { get; set; }
        public bool Resultado { get; set; }
        public List<string> Errores { get; set; }

        public ResTablasPorSchema()
        {
            Tablas = new List<string>();
            Errores = new List<string>();
        }
    }

}
