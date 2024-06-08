using Microsoft.EntityFrameworkCore;
using WebApi83.Context;
using WebApi83.Services.IServices;
using WebApi83.Services.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AplicationDBcontext>(option => option.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddTransient<IUsuarioServices, UsuarioServices>();
builder.Services.AddTransient<IAutorServices, Autorservices>();

// Habilitar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configurer el HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Usar CORS
app.UseCors("AllowAllOrigins");

app.MapControllers();

app.Run();
