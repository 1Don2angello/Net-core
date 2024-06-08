using Dapper;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Data;
using WebApi83.Context;
using WebApi83.Services.IServices;

namespace WebApi83.Services.Services
{
    public class Autorservices: IAutorServices
    {
        private readonly AplicationDBcontext _context;
        public Autorservices(AplicationDBcontext context) 
        {
            _context = context;
        }



        public async Task<Response<List<Autor>>> GetAutores() 
        {
            try
            {
                List<Autor> response = new List<Autor>();
                var result = await _context.Database.GetDbConnection().QueryAsync<Autor>("spGetAutores", new { }, commandType: System.Data.CommandType.StoredProcedure);

                response= result.ToList();

                return new Response<List<Autor>>(response);

            }catch (Exception ex)
            {
                throw new Exception("Hubo un error" + ex.Message);
            }
        }
       
        
        
        public async Task<Response<Autor>>CrearAutor(Autor i)
        {
            try
            {

                //Autor autor = new Autor();
                Autor autor= (await _context.Database.GetDbConnection().QueryAsync<Autor>("spCrearAutor", new {i.Nombre, i.Nacionalidad}, commandType:CommandType.StoredProcedure)).FirstOrDefault();
 
                return new Response<Autor>(autor);


            }catch (Exception ex)
            {
                throw new Exception("Hubo un error" + ex.Message);
            }
        }

        public async Task<Response<bool>> EliminarAutor(int pkAutor)
        {
            try
            {
                var result = await _context.Database.GetDbConnection()
                               .ExecuteAsync("spEliminarAutor", new { pkAutor }, commandType: CommandType.StoredProcedure);

                return new Response<bool>(result > 0);
            }
            catch (Exception ex)
            {
                throw new Exception("Hubo un error eliminar: " + ex.Message);
            }
        }
        public async Task<Response<Autor>> EditarAutor(int pkAutor, Autor autor)
        {
            try
            {
                var result = await _context.Database.GetDbConnection().QueryAsync<Autor>(
                    "spEditarAutor",
                    new { PkAutor = pkAutor, Nombre = autor.Nombre, Nacionalidad = autor.Nacionalidad },
                    commandType: CommandType.StoredProcedure
                );



                // Obtener el autor editado
                var autorEditado = result.FirstOrDefault();

                // Devolver la respuesta
                return new Response<Autor>(autorEditado);
            }
            catch (Exception ex)
            {
                throw new Exception("Hubo un error editar autor: " + ex.Message);
            }
        }




    }
}
