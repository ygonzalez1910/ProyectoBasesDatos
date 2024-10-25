namespace backend.Response
{
    public class ResRespaldoCompleto
    {
        public bool resultado { get; set; }
        public List<string> errores { get; set; }

        public ResRespaldoCompleto()
        {
            errores = new List<string>();
        }
    }
}
