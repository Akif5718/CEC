
using System;
using Dapper;
using CEC.Models;
using CEC.Models.ViewModels;
using CEC.Repositories.Connections;
using CEC.Repositories.Connections.Interface;
using CEC.Repositories.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Data;
using CEC.Repositories.Constants;
using CEC.Models.ResponseModels;

namespace CEC.Repositories
{
    public class FavouriteRepo :BHConnectionBase, IFavouriteRepo
    {
        private readonly ILogger<FavouriteRepo> _logger;
        public FavouriteRepo(IDbConnectionFactory dbConnectionFactory, ILogger<FavouriteRepo> logger)
            :base(dbConnectionFactory)
        {
            _logger = logger;
        }

        public async Task<ResultModel<bool>> SaveFavourite(FavouriteRequestModel model)
        {
            ResultModel<bool> resultModel = new ResultModel<bool>();
            _logger.LogInformation("Going to execute Method: SaveFavourite, Class: FavouriteRepo");

            try
            {
                var param = new DynamicParameters();
			    param.Add("@UserId", model.UserId, DbType.Int32, ParameterDirection.Input, null);
			    param.Add("@CategoryId", model.CategoryId, DbType.String, ParameterDirection.Input, null);
			    param.Add("@CategoryName", model.CategoryName, DbType.String, ParameterDirection.Input, null);
			    param.Add("@IsFavourite", model.IsFavourite, DbType.Boolean, ParameterDirection.Input, null);

                var result = await Connection
                    .ExecuteScalarAsync<int>(SPDBConstants.SAVE_FAVOURITE, param, commandType: CommandType.StoredProcedure);
                if (result == 0)
                {
                    resultModel.Data = true;
                    resultModel.IsSuccess = true;
                    resultModel.Message = "Favourite facility has been updated successfully";
                }

                return resultModel;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception occurred in Method: SaveFavourite, Class: FavouriteRepo, error :{ex.Message}");
                resultModel.Message = ex.Message;
                return resultModel;
            }
        }

    }
}


