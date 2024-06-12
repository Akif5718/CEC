using CEC.Models.ViewModels;

namespace CEC.Models.ResponseModels;

public class FilterResponseModel
{
    public List<JugendberufshilfenModel>? Jugendberufshilfen{ get; set; }
    public List<KindertageseinrichtungenModel>? Kindertageseinrichtungen{ get; set; }
    public List<SchulenModel>? Schulen{ get; set; }
    public List<SchulsozialarbeitModel>? Schulsozialarbeit{ get; set; }
}