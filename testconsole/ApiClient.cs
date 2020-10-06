using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace testconsole
{

    class TodoItemDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public bool IsComplete { get; set; }
    }

    class ApiClient
    {
        HttpClient client = new HttpClient();
        public ApiClient()
        {
            client.BaseAddress = new Uri("https://localhost:5001/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<List<TodoItemDTO>> GetItems()
        {
            HttpResponseMessage response = await client.GetAsync("api/todoitems");
            response.EnsureSuccessStatusCode();
            var todoItems = await response.Content.ReadAsAsync<List<TodoItemDTO>>();
            return todoItems;
        }

        public async Task<long> CreateItem(TodoItemDTO item)
        {
            HttpResponseMessage response = await client.PostAsJsonAsync("api/todoitems", item);
            response.EnsureSuccessStatusCode();
            var todoItem = await response.Content.ReadAsAsync<TodoItemDTO>();
            return todoItem.Id;
        }

        public async Task<TodoItemDTO> GetItem(long id)
        {
            HttpResponseMessage response = await client.GetAsync($"api/todoitems/{id}");
            response.EnsureSuccessStatusCode();
            var todoItem = await response.Content.ReadAsAsync<TodoItemDTO>();
            return todoItem;
        }
    }
}
