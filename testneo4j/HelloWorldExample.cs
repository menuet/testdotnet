using Neo4j.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace testneo4j
{
    public class HelloWorldExample : IDisposable
    {
        private readonly IDriver _driver;

        public HelloWorldExample(string uri, string user, string password)
        {
            _driver = GraphDatabase.Driver(uri, AuthTokens.Basic(user, password));
        }

        public void PrintGreeting(string message)
        {
            using (var session = _driver.Session())
            {
                var greeting = session.WriteTransaction(tx =>
                {
                    var result = tx.Run("USE mytest CREATE (a:Greeting) " +
                                        "SET a.message = $message " +
                                        "RETURN a.message + ', from node ' + id(a)",
                        new { message });
                    return result.Single()[0].As<string>();
                });
                Console.WriteLine(greeting);
                var greetings = session.ReadTransaction(tx =>
                {
                    var result = tx.Run("USE mytest MATCH (a:Greeting) RETURN id(a), a.message");
                    return result.Select(r => (r[0].As<string>(), r[1].As<string>())).ToList();
                });
                foreach(var g in greetings)
                    Console.WriteLine($"{g.Item1} : {g.Item2}");
            }
        }

        public void Dispose()
        {
            _driver?.Dispose();
        }
    }
}
