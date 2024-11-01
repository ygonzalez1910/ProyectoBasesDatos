using backend.Services;
using Logica;
using Microsoft.Extensions.Logging;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configuraci�n de Serilog para archivo de log y consola
var logger = new LoggerConfiguration()
    .WriteTo.Console()  // Salida a la consola
    .WriteTo.File("logs/logfile.log", rollingInterval: RollingInterval.Day)  // Salida al archivo de logs con archivo por d�a
    .CreateLogger();

builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);

// Configuraci�n de servicios
builder.Services.AddControllers();
builder.Services.AddScoped<OracleDbService>();

// Configuraci�n de CORS para aceptar todas las direcciones
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Registrar el servicio de Respaldo
builder.Services.AddScoped<Respaldo>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("OracleConnection");
    var logger = provider.GetRequiredService<ILogger<Respaldo>>();
    return new Respaldo(connectionString, logger);
});

// Registrar el servicio de Schemas
builder.Services.AddScoped<Schema>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("OracleConnection");
    return new Schema(connectionString);
});

// Registrar el servicio de TableSpace
builder.Services.AddScoped<TableSpace>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("OracleConnection");
    return new TableSpace(connectionString);
});

builder.Services.AddScoped<Tuning>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("OracleConnection");
    return new Tuning(connectionString);
});

builder.Services.AddScoped<Seguridad>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("OracleConnection");
    return new Seguridad(connectionString);
});

builder.Services.AddScoped<Auditoria>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("OracleConnection");
    var logger = provider.GetRequiredService<ILogger<Auditoria>>();
    return new Auditoria(connectionString, logger);
});

builder.Services.AddScoped<Directorio>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("OracleConnection");
    var logger = provider.GetRequiredService<ILogger<Directorio>>();
    return new Directorio(connectionString, logger);
});

builder.Services.AddScoped<Performance>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("OracleConnection");
    var logger = provider.GetRequiredService<ILogger<Performance>>();
    return new Performance(connectionString, logger);
});

// Configuraci�n de Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configuraci�n del pipeline de la aplicaci�n
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configuraci�n de CORS antes de mapear los controladores
app.UseCors("AllowAllOrigins");

// app.UseHttpsRedirection(); // Opcional: Puedes deshabilitar esto para desarrollo
app.UseAuthorization();

app.MapControllers();
app.Run();
