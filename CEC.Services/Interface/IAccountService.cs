using System;
using CEC.Models;
using CEC.Models.Helper;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;

namespace CEC.Services.Interface
{
	public interface IAccountService
	{
        Task<ResultModel<bool>> RegisterUser(RegisterUserModel model);
        Task<ResultModel<LoginResponse>> LoginUser(LoginUserModel requestModel);
        Task<bool> IsValidUser(RoleValidationModel roleModel);
        Task<ResultModel<bool>> ChangeUserPassword(ChangeUserPasswordModel model);
	}
}

