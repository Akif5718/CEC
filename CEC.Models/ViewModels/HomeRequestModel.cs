namespace CEC.Models.ViewModels;

public class HomeRequestModel
{
    public double? X { get; set; }
    public double? Y { get; set; }
}

public class UserHomeRequestModel : HomeRequestModel
{
    public int Id { get; set;}
    public string UserName { get; set;}
    public string FirstName { get; set;}
    public string LastName { get; set;}
    public string? AspnetUserId { get; set;}
    public int UserTypeId { get; set;}
    public string? Email { get; set;}
    public string PhoneNumber { get; set;}
    public bool Active { get; set;}
}
