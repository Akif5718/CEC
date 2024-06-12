namespace CEC.Models;

public class ModelBase
{
    public int Id { get; set; }
    public int CreatedBy { get; set; }
    public DateTime? CreatedDate { get; set; }
    public int? ModifiedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }
}

public class RequestModelBase
{
    public int? Id { get; set; }
    public int? ModifiedBy { get; set; }
}