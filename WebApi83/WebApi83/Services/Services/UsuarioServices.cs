using Domain.DTOs;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using WebApi83.Context;
using WebApi83.Services.IServices;

namespace WebApi83.Services.Services
{
    public class UsuarioServices : IUsuarioServices
    {
        private readonly AplicationDBcontext _context;
        public string Mensaje;

        public UsuarioServices(AplicationDBcontext context)
        {
            _context = context;
        }

        //Lista de usuarios

        public async Task<Response<List<Usuario>>> ObtenerUsuarios()
        {
            try
            {
                List<Usuario> response = await _context.Usuarios.Include(y=>y.Roles).ToListAsync();

                return new Response<List<Usuario>>(response);

            }
            catch (Exception ex)
            {
                throw new Exception("error" + ex.Message);
            }
        }

        //obtener por id
        public async Task<Response<Usuario>> Byid(int id ) 
        {
            try 
            {
                Usuario usuario = await  _context.Usuarios.FindAsync(id);

                return new Response<Usuario>(usuario);

            } catch (Exception ex) 
            {
                throw new Exception();
            }
        }

        //crear usuario

        public async Task<Response<Usuario>> Crear(UsuarioDTO request) 
        {

            try
            {
                Usuario usuario = new Usuario();
                usuario.Nombre = request.Nombre;
                usuario.User = request.User;
                usuario.Password = request.Password;
                usuario.FkRol = request.FkRol;

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                return new Response<Usuario>(usuario);


            }
            catch (Exception ex)
            {
                throw new Exception("error" + ex.Message);
            }

        }
        //actualizar
        public async Task<Response<Usuario>> Update(int id, UsuarioDTO updatedUsuario)
        {
            try
            {
                // Busca el usuario por ID
                Usuario existingUsuario = await _context.Usuarios.FindAsync(id);



                existingUsuario.Nombre = updatedUsuario.Nombre;
                existingUsuario.User = updatedUsuario.User;
                existingUsuario.Password = updatedUsuario.Password;

                _context.Entry(existingUsuario).State = EntityState.Modified;

                await _context.SaveChangesAsync();


                return new Response<Usuario>(existingUsuario);
            }
            catch (Exception ex)
            {
                return new Response<Usuario>(ex.Message);
            }
        }



        //eliminar por id
        public async Task<Response<Usuario>> Delete(int id)
        {
            try
            {
                // Busca el usuario por ID
                Usuario usuario = await _context.Usuarios.FindAsync(id);

                // Elimina el usuario del contexto
                _context.Usuarios.Remove(usuario);

                // Guarda los cambios en la base de datos
                await _context.SaveChangesAsync();

                // Devuelve una respuesta indicando que el usuario fue eliminado con éxito
                return new Response<Usuario>(usuario);
            }
            catch (Exception ex)
            {
                // Maneja cualquier excepción y devuelve una respuesta con el mensaje de error
                return new Response<Usuario>(ex.Message);
            }
        }

        //public async Task<Response<List<Usuario>>> Obtenerjoin() 
        //{
        //   try
        //    {
        //        // Llama al procedimiento almacenado utilizando FromSqlRaw
        //        List<Usuario>  usuarios = await _context.Usuarios.FromSqlRaw("EXEC ObtenerUsuariosConRoles").ToListAsync();

        //        return new Response<List<Usuario>>(usuarios);
        //    }
        //     catch (Exception ex)
        //    {
        //        throw new Exception("Error al obtener usuarios con roles: " + ex.Message);
        //    }
        //}






    }
}
