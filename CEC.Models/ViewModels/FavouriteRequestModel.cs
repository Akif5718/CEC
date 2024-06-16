namespace CEC.Models.ViewModels;

public class FavouriteRequestModel
{
    public int UserId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryId { get; set; }
    public bool IsFavourite { get; set; }
}