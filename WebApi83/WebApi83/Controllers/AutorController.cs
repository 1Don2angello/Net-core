using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi83.Services.IServices;
using WebApi83.Services.Services;

namespace WebApi83.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutorController : ControllerBase
    {
        private readonly IAutorServices _autorservices;
        public AutorController(IAutorServices autorServices)
        {
            _autorservices = autorServices;

        }

        [HttpGet]
        public async Task<IActionResult> GetAutores() 
        {
            return Ok(await _autorservices.GetAutores());
        }
        [HttpPost]
        public async Task<IActionResult> CrearAutor([FromBody]Autor autor)
        {
            return Ok(await _autorservices.CrearAutor(autor));

        }
        [HttpDelete("{pkAutor}")]
        public async Task<IActionResult> EliminarAutor(int pkAutor)
        {
            var response = await _autorservices.EliminarAutor(pkAutor);

            if (response.Suceded)
            {
                return Ok(new { success = true, message = "Autor eliminado." });
            }
            else
            {
                return NotFound(new { success = false, message = "No se pudo eliminar el autor. " + response.Message });
            }
        }
        [HttpPut("{pkAutor}")]
        public async Task<IActionResult> EditarAutor(int pkAutor, Autor autor)
        {
            try
            {
                var response = await _autorservices.EditarAutor(pkAutor, autor);

                if (response.Suceded)
                {
                    return Ok(new { success = true, message = "Autor editado." });
                }
                else
                {
                    return NotFound(new { success = false, message = "No se pudo editar el autor. " + response.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al editar el autor: {ex.Message}");
            }
        }




    }
}
