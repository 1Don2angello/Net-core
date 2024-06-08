using Domain.Entities;

namespace WebApi83.Services.IServices
{
    public interface IAutorServices
    {
        public Task<Response<List<Autor>>> GetAutores();
        public Task<Response<Autor>> CrearAutor(Autor i);
        Task<Response<bool>> EliminarAutor(int pkAutor);
        Task<Response<Autor>> EditarAutor(int pkAutor, Autor autor);


    }
}
