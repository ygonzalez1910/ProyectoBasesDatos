using Oracle.ManagedDataAccess.Client;

namespace backend.Services
{
    public class OracleDbService
    {

        private readonly string _connectionString;
        private readonly ILogger<OracleDbService> _logger;

        public OracleDbService(IConfiguration configuration, ILogger<OracleDbService> logger)
        {
            _connectionString = configuration.GetConnectionString("OracleConnection");
            _logger = logger;
        }

        public async Task<bool> TestConnectionAsync()
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Conexión exitosa a Oracle!");

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "SELECT 1 FROM DUAL";
                        var result = await command.ExecuteScalarAsync();
                        _logger.LogInformation($"Resultado de la consulta: {result}");
                    }
                    return true;
                }
            }
            catch (OracleException ex)
            {
                _logger.LogError($"Error de Oracle: {ex.Message}, Código: {ex.Number}");
                throw new Exception($"Error de Oracle: {ex.Message}, Código: {ex.Number}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error inesperado: {ex.Message}");
                throw;
            }
        }
    }
}
