using Models;

public class EstadisticasIndice
{
    public string NombreIndice { get; set; }
    public int Altura { get; set; }
    public int BloquesHoja { get; set; }
    public int ClavesDistintas { get; set; }
    public double PromBloquesHojaPorClave { get; set; }
    public double PromBloquesDatosPorClave { get; set; }
}