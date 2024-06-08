using Domain.DTOs;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using WebApi83.Services.IServices;
using WebApi83.Services.Services;

namespace WebApi83.Controllers
{
    [ApiController]
    [Route("Usuario")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioServices _usuarioServices;
        public UsuarioController(IUsuarioServices usuarioServices)
        {
            _usuarioServices = usuarioServices;
        }

        [HttpGet]
        public async Task<IActionResult> Getusers()
        {
            var response = await _usuarioServices.ObtenerUsuarios();
            return Ok(response);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Getuser(int id)
        {
            return Ok(await _usuarioServices.Byid(id));
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id,[FromBody] UsuarioDTO updatedUsuario) 
        {
            return Ok(await _usuarioServices.Update(id, updatedUsuario));
        }

        [HttpPost("CrearUser")]
        public async Task<IActionResult> PostUser([FromBody] UsuarioDTO i)
        {
            return Ok(await _usuarioServices.Crear(i));
        }
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUsuer(int id)
        {
            return Ok(await _usuarioServices.Delete(id));

        }

        //[HttpGet]
        //public async Task<IActionResult> Obtener() 
        //{
        //    return Ok(await _usuarioServices.Obtenerjoin());
        //}



    }
}
