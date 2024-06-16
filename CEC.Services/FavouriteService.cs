using CEC.Models;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;
using CEC.Repositories;
using CEC.Repositories.Interface;
using CEC.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CEC.Services
{
    public class FavouriteService : IFavouriteService
    {
        private readonly ILogger<FavouriteRepo> _logger;
        private readonly IFavouriteRepo _repo;
        public FavouriteService(ILogger<FavouriteRepo> logger, IFavouriteRepo repo)
        {
            _logger = logger;
            _repo = repo;
        }

        public async Task<ResultModel<bool>> SaveFavourite(FavouriteRequestModel model)
        {
            _logger.LogInformation("Going to execute Method: SaveFavourite, Class: FavouriteService");
            var result = await _repo.SaveFavourite(model);
            _logger.LogInformation("Execution completed Method: SaveFavourite, Class: FavouriteService");
            return result;
        }
    }
}


