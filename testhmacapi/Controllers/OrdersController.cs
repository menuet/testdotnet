using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using softaware.Authentication.Hmac;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using testhmacapi.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace testhmacapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        // GET: api/<OrdersController>
        [Authorize(AuthenticationSchemes = HmacAuthenticationDefaults.AuthenticationScheme)]
        [HttpGet]
        public IEnumerable<Order> Get()
        {
            return Order.GetOrders();
        }

        // GET api/<OrdersController>/5
        [HttpGet("{id}")]
        public Order Get(int id)
        {
            return new Order();
        }

        // POST api/<OrdersController>
        [HttpPost]
        public void Post([FromBody] Order order)
        {
        }

        // PUT api/<OrdersController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] Order order)
        {
        }

        // DELETE api/<OrdersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
