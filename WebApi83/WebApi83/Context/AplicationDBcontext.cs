using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace WebApi83.Context
{
    public class AplicationDBcontext : DbContext
    {
        public AplicationDBcontext(DbContextOptions options) : base(options) 
        { }

        //Modelos a Mapear
        public DbSet<Usuario> Usuarios { get; set; } 
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Autor> Autores { get; set; }
        public DbSet<Libro> Libros { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            //insertar en tabla roles 
            modelBuilder.Entity<Usuario>().HasData(
                new Usuario 
                {
                    PkUsuario = 1,
                    Nombre = "German",
                    User = "Torres1",
                    Password = "12345",
                    FkRol = 1
                }

                );

            //insertar en la trabla usuarios
            modelBuilder.Entity<Rol>().HasData(
                new Rol 
                {
                    PkRol = 1,
                    Nombre = "sa"
                }
                );
        
        }
    }
}
