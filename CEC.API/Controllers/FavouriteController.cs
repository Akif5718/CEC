using CEC.API.ActionFilters;
using CEC.Models;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;
using CEC.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CEC.API.Controllers;

[ApiController]
[RoleValidation(Roles = new string[]{"Customer"})]
[Route("api/[controller]")]
public class FavouriteController : Controller
{
    private readonly ILogger<FavouriteController> _logger;
    private readonly IFavouriteService _favouriteService;
    public FavouriteController(ILogger<FavouriteController> logger, IFavouriteService favouriteService)
    {
        _logger = logger;
        _favouriteService = favouriteService;
    }
    
    [HttpPost("save")]
    public async Task<IActionResult> SaveFavourite(FavouriteRequestModel requestModel)
    {
        _logger.LogInformation("Going to execute _favouriteService.SaveFavourite()");
        var result = await _favouriteService.SaveFavourite(requestModel);
        _logger.LogInformation("Execution completed _favouriteService.SaveFavourite()");

        if (result.IsSuccess)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
    
    
}