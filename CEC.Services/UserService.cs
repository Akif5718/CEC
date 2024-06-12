﻿using CEC.Models;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;
using CEC.Repositories;
using CEC.Repositories.Interface;
using CEC.Services.Interface;
using Microsoft.Extensions.Logging;

namespace CEC.Services
{
    public class UserService : IUserService
    {
        private readonly ILogger<UserRepo> _logger;
        private readonly IUserRepo _repo;
        public UserService(ILogger<UserRepo> logger, IUserRepo repo)
        {
            _logger = logger;
            _repo = repo;
        }

        public async Task<ResultModel<UserModel>> SaveUser(UserModel model)
        {
            _logger.LogInformation("Going to execute Method: SaveUser, Class: UserService");
            var result = await _repo.SaveUser(model);
            _logger.LogInformation("Execution completed Method: SaveUser, Class: UserService");
            return await GetUserById(result);
        }

        public async Task<ResultModel<UserModel>> GetUserById(int id)
        {
            _logger.LogInformation("Going to execute Method: GetUserById, Class: UserService");
            var result = await _repo.GetUserById(id);
            _logger.LogInformation("Execution completed Method: GetUserById, Class: UserService");
            return result;
        }

        public async Task<ResultModel<List<UserResponse>>> GetAllUser(UserListModel model)
        {
            _logger.LogInformation("Going to execute Method: GetAllUser, Class: UserService");
            var result = await _repo.GetAllUser(model);
            _logger.LogInformation("Execution completed Method: GetAllUser, Class: UserService");
            return result;
        }

        public async Task<ResultModel<int>> GetAllUserCount(UserListModel model)
        {
            _logger.LogInformation("Going to execute Method: GetAllUserCount, Class: UserService");
            var result = await _repo.GetAllUserCount(model);
            _logger.LogInformation("Execution completed Method: GetAllUserCount, Class: UserService");
            return result;
        }
        
        public async Task<ResultModel<bool>> IsUserNameUnique(string? userName)
        {
            _logger.LogInformation("Going to execute Method: IsUserNameUnique, Class: UserService");
            var result = await _repo.IsUserNameUnique(userName);
            _logger.LogInformation("Execution completed Method: IsUserNameUnique, Class: UserService");
            return result;
        }

        public async Task<ResultModel<UserModel>> GetUserByEmail(string identityUserEmail)
        {
            _logger.LogInformation("Going to execute Method: GetUserByEmail, Class: UserService");
            var result = await _repo.GetUserByEmail(identityUserEmail);
            _logger.LogInformation("Execution completed Method: GetUserByEmail, Class: UserService");
            return result;
        }
    }
}


