using System;
using CEC.Models;
using CEC.Models.Helper;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;

namespace CEC.Repositories.Interface
{
	public interface IAccountRepo
	{
		Task<ResultModel<bool>> RegisterUser(RegisterUserModel model);
        Task<ResultModel<bool>> LoginUser(LoginUserModel model);
        Task<string> GenerateToken(LoginUserModel model);
        Task<bool> IsValidUser(RoleValidationModel roleModel);
	}
}

