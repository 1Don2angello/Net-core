using Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class UsuarioDTO
    {
        public string Nombre { get; set; }

        public string User { get; set; }

        public string Password { get; set; }

        public int? FkRol { get; set; }


    }
}
