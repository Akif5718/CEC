using CEC.Models;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;
using CEC.Repositories;
using CEC.Repositories.Interface;
using CEC.Services.Interface;
using Microsoft.Extensions.Logging;

namespace CEC.Services
{
    public class SearchService : ISearchService
    {
        private readonly ILogger<SearchService> _logger;
        private readonly ISearchRepo _repo;
        public SearchService(ILogger<SearchService> logger, ISearchRepo repo)
        {
            _logger = logger;
            _repo = repo;
        }


        public async Task<ResultModel<FilterResponseModel>> GetAllData(FilterRequestModel model)
        {
            _logger.LogInformation("Going to execute Method: GetAllData, Class: SearchService");
            var result = await _repo.GetAllData(model);
            _logger.LogInformation("Execution completed Method: GetAllData, Class: SearchService");
            return result;
        }
    }
}


