
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
    public class SearchRepo :BHConnectionBase, ISearchRepo
    {
        private readonly ILogger<SearchRepo> _logger;
        public SearchRepo(IDbConnectionFactory dbConnectionFactory, ILogger<SearchRepo> logger)
            :base(dbConnectionFactory)
        {
            _logger = logger;
        }

        public async Task<ResultModel<FilterResponseModel>> GetAllData(FilterRequestModel model)
        {
            ResultModel<FilterResponseModel> resultModel = new ResultModel<FilterResponseModel>();
            resultModel.Data = new FilterResponseModel();
            _logger.LogInformation("Going to execute Method: GetAllData, Class: SearchRepo");
            try
            {
                var param = new DynamicParameters();
                param.Add("@IsJugendberufshilfen", model.IsJugendberufshilfen, DbType.Boolean, ParameterDirection.Input, null);
                param.Add("@IsKindertageseinrichtungen", model.IsKindertageseinrichtungen, DbType.Boolean, ParameterDirection.Input, null);
                param.Add("@IsSchulen", model.IsSchulen, DbType.Boolean, ParameterDirection.Input, null);
                param.Add("@IsSchulsozialarbeit", model.IsSchulsozialarbeit, DbType.Boolean, ParameterDirection.Input, null);
                
                using (var multi = await Connection.QueryMultipleAsync(SPDBConstants.SEARCH_MAP_DATA, param, commandType: CommandType.StoredProcedure))
                {
                    resultModel.Data.Schulen = (await multi.ReadAsync<SchulenModel>()).ToList();
                    resultModel.Data.Kindertageseinrichtungen = (await multi.ReadAsync<KindertageseinrichtungenModel>()).ToList();
                    resultModel.Data.Schulsozialarbeit = (await multi.ReadAsync<SchulsozialarbeitModel>()).ToList();
                    resultModel.Data.Jugendberufshilfen = (await multi.ReadAsync<JugendberufshilfenModel>()).ToList();
                }
                
                resultModel.Message = "Executed successfully";
                resultModel.IsSuccess = true;
                _logger.LogInformation("Execution completed Method: GetAllData, Class: SearchRepo");
                return resultModel;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception occurred in Method: GetAllData, Class: SearchRepo, error :{ex.Message}");
                resultModel.Data = null;
                resultModel.Message = "Something went wrong";
                resultModel.IsSuccess = false;
                resultModel.ErrorMessages = ex.Message.Split(Environment.NewLine);
                return resultModel;
            }
        }
    }
}


