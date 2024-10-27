using System.Collections.Generic;
using Models;

namespace Response
{
    public class ResGetTableSpaces
    {
        public List<TableSpaceModel> TableSpaces { get; set; } = new List<TableSpaceModel>();
        public List<string> Errores { get; set; } = new List<string>();
    }
}
