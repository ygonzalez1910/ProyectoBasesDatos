using System.Collections.Generic;

namespace Response
{
    public class ResVerTodosLosIndices
    {
        public bool Exito { get; set; } // Indica si la operación fue exitosa
        public string Mensaje { get; set; } // Mensaje descriptivo del resultado
        public bool Resultado { get; set; } // Resultado de la operación (exitoso o no)
        public List<string> Indices { get; set; } = new List<string>(); // Lista de nombres de índices
        public List<string> Errores { get; set; } = new List<string>(); // Lista de errores en caso de fallo
    }
}
