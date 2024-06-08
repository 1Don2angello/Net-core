using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Response<T>
    {
        public Response() { }
        public Response(T data, string message=null) 
        {
            Suceded = true;
            Message = message;
            Result = data;
        }
        public Response(string message) 
        {
            Suceded = false;
            Message = message;
        }

        public bool Suceded { get; set; }
        public string Message { get; set; }
        public T Result { get; set; }
    }
}
