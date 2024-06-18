using CEC.Models;
using CEC.Models.Helper;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;
using CEC.Repositories;
using CEC.Repositories.Interface;
using CEC.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CEC.Services
{
	public class AccountService:IAccountService
	{
        private readonly ILogger<AccountRepo> _logger;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IAccountRepo _accountRepo;
        private readonly IUserService _userService;
        public AccountService(ILogger<AccountRepo> logger, IAccountRepo accountRepo, 
            IUserService userService, UserManager<IdentityUser> userManager)
		{
			_logger = logger;
            _accountRepo = accountRepo;
            _userService = userService;
            _userManager = userManager;
        }
        
        public async Task<ResultModel<bool>> RegisterUser(RegisterUserModel model)
        {
            _logger.LogInformation("Going to execute Method: RegisterUser, Class: AccountService");
            var result = await _accountRepo.RegisterUser(model);
            _logger.LogInformation("Execution completed Method: RegisterUser, Class: AccountService");
            return result;
        }
        
        public async Task<ResultModel<LoginResponse>> LoginUser(LoginUserModel model)
        {
            ResultModel<LoginResponse> result = new ResultModel<LoginResponse>();
            _logger.LogInformation("Going to execute Method: LoginUser, Class: AccountService");
            var resultLogin = await _accountRepo.LoginUser(model);
            if (!resultLogin.IsSuccess)
            {
                result.Message = resultLogin.Message;
                result.ErrorMessages = resultLogin.ErrorMessages;
                _logger.LogError("Error Occured Method: LoginUser, Class: AccountService");
                return result;
            }
            var identityUser = await _userManager.FindByEmailAsync(model.UserName) ?? await _userManager.FindByNameAsync(model.UserName);
            var userData = await _userService.GetUserByEmail(identityUser.Email);
            result.Data = new LoginResponse()
            {
                Token = await _accountRepo.GenerateToken(model),
                UserId = userData.Data.Id,
                UserName = userData.Data.UserName,
                UserType =  userData.Data.UserTypeId == 1 ? "Admin" : "Customer"
            };
            result.IsSuccess = resultLogin.IsSuccess;
            result.Message = resultLogin.Message;
            _logger.LogInformation("Execution completed Method: LoginUser, Class: AccountService");
            return result;
        }
        
        public async Task<ResultModel<bool>> ChangeUserPassword(ChangeUserPasswordModel model)
        {
            ResultModel<bool> res = new ResultModel<bool>();
            _logger.LogInformation("Going to execute Method: ChangeUserPassword, Class: AccountService");
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null)
            {
                _logger.LogInformation($"Going to execute _userManager.ChangePasswordAsync({model})");
                var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.Password);
                _logger.LogInformation($"Completed _userManager.ChangePasswordAsync({model})");

                if (result.Succeeded)
                {
                    res.IsSuccess = true;
                    res.Data = true;
                    res.Message = "Password has been successfully changed";
                }
                else
                {
                    res.Message = "Invalid Current Password";
                    _logger.LogError("User password changing failed.");
                }
            }
            
            return res;
        }
        
        public async Task<bool> IsValidUser(RoleValidationModel roleModel)
        {
            _logger.LogInformation("Going to execute Method: IsValidUser, Class: AccountService");
            var result = await _accountRepo.IsValidUser(roleModel);
            _logger.LogInformation("Execution completed Method: IsValidUser, Class: AccountService");
            return result;
        }
    }
}

