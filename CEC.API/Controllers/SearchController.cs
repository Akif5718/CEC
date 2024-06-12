using Microsoft.AspNetCore.Mvc;
using CEC.API.ActionFilters;
using CEC.Models;
using CEC.Models.ViewModels;
using CEC.Services.Interface;

namespace CEC.API.Controllers;

[ApiController]
[RoleValidation(Roles = new string[]{"Customer"})]
[Route("api/[controller]")]
public class SearchController : Controller
{
    private readonly ILogger<SearchController> _logger;
    private readonly ISearchService _searchService;
    
    public SearchController(ILogger<SearchController> logger, ISearchService searchService)
    {
        _logger = logger;
        _searchService = searchService;
    }
    [HttpPost()]
    [Route("get-all")]
    public async Task<IActionResult> GetAllData(FilterRequestModel filterRequest)
    {
        _logger.LogInformation("GetAllData starts");
        try
        {
            _logger.LogInformation($"Going to execute _userService.GetAllData()");
            var response = await _searchService.GetAllData(filterRequest);
            _logger.LogInformation($"Completed _userService.GetAllData()");
            if (response.Data != null)
            {
                response.IsSuccess = true;
                return Ok(response);
            }
            else
            {
                _logger.LogError("GetAllData - failed to execute");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError("GetAllData - Exception : " + ex.ToString());
        }
        return StatusCode(500);
    }
}