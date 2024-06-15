using CEC.API.ActionFilters;
using CEC.Models;
using CEC.Models.ViewModels;
using CEC.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CEC.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : Controller
{
    private readonly ILogger<UserController> _logger;
    private readonly IUserService _userService;
    public UserController(ILogger<UserController> logger, IUserService userService)
    {
        _logger = logger;
        _userService = userService;
    }
    
    [RoleValidation(Roles = new string[]{"Admin,Customer"})]
    [HttpPost()]
    [Route("get-by-id")]
    public async Task<IActionResult> GetUserById([FromBody] int id)
    {
        _logger.LogInformation("GetUserById starts");
        ResultModel<UserModel> response = new ResultModel<UserModel>();
        try
        {
            if (id == 0)
            {
                response.Message = "id can not be 0";
                _logger.LogError($"GetUserById - {response.Message}");
                return BadRequest(response);
            }
            _logger.LogInformation($"Going to execute _userService.GetUserById()");
            response = await _userService.GetUserById(id);
            _logger.LogInformation($"Completed _userService.GetUserById()");
            if (response.Data != null)
            {
                response.IsSuccess = true;
                return Ok(response);
            }
            else
            {
                _logger.LogError("GetUserById - failed to execute");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError("GetUserById - Exception : " + ex.ToString());
        }
        return StatusCode(500);
    }
    
    [RoleValidation(Roles = new string[]{"Admin"})]
    [HttpPost()]
    [Route("get-all")]
    public async Task<IActionResult> GetAllUsers(UserListModel user)
    {
        _logger.LogInformation("GetAllUsers starts");
        try
        {
            _logger.LogInformation($"Going to execute _userService.GetAllUser()");
            var response = await _userService.GetAllUser(user);
            _logger.LogInformation($"Completed _userService.GetAllUser()");
            if (response.Data != null)
            {
                response.IsSuccess = true;
                return Ok(response);
            }
            else
            {
                _logger.LogError("GetAllUser - failed to execute");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError("GetAllUser - Exception : " + ex.ToString());
        }
        return StatusCode(500);
    }
    
    [RoleValidation(Roles = new string[]{"Admin"})]
    [HttpPost()]
    [Route("get-all-count")]
    public async Task<IActionResult> GetAllUserCount(UserListModel user)
    {
        _logger.LogInformation("GetAllUsersCount starts");
        try
        {
            _logger.LogInformation($"Going to execute _userService.GetAllUserCount()");
            var response = await _userService.GetAllUserCount(user);
            _logger.LogInformation($"Completed _userService.GetAllUserCount()");
            if (response.Data != null)
            {
                response.IsSuccess = true;
                return Ok(response);
            }
            else
            {
                _logger.LogError("GetAllUserCount - failed to execute");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError("GetAllUserCount - Exception : " + ex.ToString());
        }
        return StatusCode(500);
    }
    [RoleValidation(Roles = new string[]{"Admin,Customer"})]
    [HttpPost("save")]
    public async Task<IActionResult> SaveUser(UserHomeRequestModel requestModel)
    {
        _logger.LogInformation("Going to execute _userService.SaveUser()");
        var result = await _userService.SaveUser(requestModel);
        _logger.LogInformation("Execution completed _userService.SaveUser()");

        if (result.IsSuccess)
        {
            return Ok(result);
        }
        return BadRequest(result);
    }
    
    
}