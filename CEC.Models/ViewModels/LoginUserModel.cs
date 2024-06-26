using System.ComponentModel.DataAnnotations;

namespace CEC.Models.ViewModels;

public class LoginUserModel
{
    [Required(ErrorMessage = "UserName is required")]
    public string? UserName { get; set; }
    
    [Required(ErrorMessage = "Password is required")]
    public string? Password { get; set; }
}