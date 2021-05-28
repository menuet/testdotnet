using System;

namespace testneo4j
{
    class Program
    {
        public static void Main()
        {
            using (var greeter = new HelloWorldExample("bolt://localhost:7687", "neo4j", "TestPascal"))
            {
                greeter.PrintGreeting("hello, world");
            }
        }
    }
}
