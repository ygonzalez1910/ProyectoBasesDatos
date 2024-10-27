namespace Models
{
    public class TableSpaceModel
    {
        public string TableSpaceName { get; set; }
        public string FileName { get; set; }
        public decimal SizeMB { get; set; }
        public string AutoExtensible { get; set; }
        public decimal MaxSizeMB { get; set; }
    }
}
