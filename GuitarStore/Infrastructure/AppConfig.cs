namespace GuitarStore.Infrastructure
{
    public class AppConfig
    {
        public Company Company { get; set; } = new Company();
        public Database Database { get; set; } = new Database();
    }

    public class Database
    {
        public string? ConnectionString { get; set; }
    }

    public class Company
    {
        public string? CompanyName { get; set; }
        public Contact[]? Contacts { get; set; }

        public class Contact
        {
            public string? City { get; set; }
            public string? Number { get; set; }
        }
    }
}
