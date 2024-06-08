using Domain.DTOs;
using Domain.Entities;
using WebApi83.Context;

namespace WebApi83.Services.IServices
{
    public interface IUsuarioServices
    {
        public Task<Response<List<Usuario>>> ObtenerUsuarios();
        public Task<Response<Usuario>> Byid(int id);
        public Task<Response<Usuario>> Crear(UsuarioDTO usuario);
        public Task<Response<Usuario>> Delete(int id);
        public Task<Response<Usuario>> Update(int id, UsuarioDTO updatedUsuario);
        //public Task<Response<List<Usuario>>> Obtenerjoin();
    }
}
