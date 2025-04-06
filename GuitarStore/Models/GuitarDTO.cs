namespace GuitarStore.Models
{
    public class GuitarDTO
    {
        public int Id { get; set; }
        public string? GuitarModel { get; set; }
        public string? GuitarType { get; set; }
        public double GuitarPrice { get; set; }
        public List<string?>? GuitarImageFileNames { get; set; }
        public string? GuitarBrand { get; set; }
        public int GuitarYear { get; set; }
    }
}
