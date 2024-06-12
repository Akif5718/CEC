
using CEC.Models;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;


namespace CEC.Repositories.Interface
{
    public interface ISearchRepo
    {
        Task<ResultModel<FilterResponseModel>> GetAllData(FilterRequestModel model);
    }
 }



