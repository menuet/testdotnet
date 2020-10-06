using System;
using System.Threading.Tasks;

namespace testconsole
{
    class Program
    {
        static async Task Example()
        {
            var apiClient = new ApiClient();

            try
            {
                var newItemId = await apiClient.CreateItem(new TodoItemDTO { Name = "BOB", IsComplete = true });
                Console.WriteLine($"New Item Id: {newItemId}");

                var newItem = await apiClient.GetItem(newItemId);
                Console.WriteLine($"New Item: {newItem}");

            } catch(Exception e)
            {
                Console.WriteLine($"Problem: {e.Message}");
            }

            var items = await apiClient.GetItems();

            Console.WriteLine($"Got {items.Count} items");
            foreach (var item in items)
            {
                Console.WriteLine(item);
            }
        }

        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            Example().GetAwaiter().GetResult();
        }
    }
}
