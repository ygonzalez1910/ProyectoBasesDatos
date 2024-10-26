using backend.Services;
using Logica;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Configuraci�n de servicios
builder.Services.AddControllers();
builder.Services.AddScoped<OracleDbService>();

// Configuraci�n de CORS para aceptar todas las direcciones
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Registrar el servicio Respaldo
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

// **Mueve la llamada UseCors antes de MapControllers**
app.UseCors("AllowAllOrigins");

// app.UseHttpsRedirection(); // Opcional: Puedes deshabilitar esto para desarrollo
app.UseAuthorization();
app.MapControllers();
app.Run();
