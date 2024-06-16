
using CEC.Models;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;


namespace CEC.Repositories.Interface
{
    public interface IFavouriteRepo
    {
        Task<ResultModel<bool>> SaveFavourite(FavouriteRequestModel model);
    }
 }



