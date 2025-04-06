namespace GuitarStore.Domain.Entities
{
    public class GuitarImage : EntityBase
    {
        public string? FileName { get; set; }

        public int GuitarId { get; set; }
        public Guitar? Guitar { get; set; }
    }

}
