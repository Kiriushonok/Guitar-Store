namespace GuirarStore.Infrastructure
{
    public class AppConfig
    {
        public Company Company { get; set; } = new Company();
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
