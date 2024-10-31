namespace Response
{
    public class ResponseBase
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class CrearDirectorioResponse : ResponseBase
    {
        public string NombreDirectorio { get; set; }
    }

    public class EliminarDirectorioResponse : ResponseBase
    {
        public string NombreDirectorio { get; set; }
    }
}
