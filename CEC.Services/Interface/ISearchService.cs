using CEC.Models;
using CEC.Models.ResponseModels;
using CEC.Models.ViewModels;


namespace CEC.Services.Interface
{
    public interface ISearchService
    {
        Task<ResultModel<FilterResponseModel>> GetAllData(FilterRequestModel model);
    }
 }




