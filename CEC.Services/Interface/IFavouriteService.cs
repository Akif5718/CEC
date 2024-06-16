using CEC.Models;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;


namespace CEC.Services.Interface
{
    public interface IFavouriteService
    {
        Task<ResultModel<bool>> SaveFavourite(FavouriteRequestModel model);
    }
 }




