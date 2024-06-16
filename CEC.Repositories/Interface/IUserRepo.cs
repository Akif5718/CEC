
using CEC.Models;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;


namespace CEC.Repositories.Interface
{
    public interface IUserRepo
    {
        Task<int> SaveUser(UserHomeRequestModel model);
        Task<ResultModel<UserResponse>> GetUserById(int id);
        Task<ResultModel<List<UserResponse>>> GetAllUser(UserListModel model);
        Task<ResultModel<int>> GetAllUserCount(UserListModel model);
        Task<ResultModel<bool>> IsUserNameUnique(string? userName);
        Task<ResultModel<UserModel>> GetUserByEmail(string identityUserEmail);
        Task<ResultModel<bool>> DeleteUser(int userId);
    }
 }



