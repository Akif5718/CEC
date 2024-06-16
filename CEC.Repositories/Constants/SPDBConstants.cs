namespace CEC.Repositories.Constants;

public class SPDBConstants
{
    //User
    public const string IS_VALID_USER = "dbo.IsValidUser";
    public const string IS_UNIQUE_USER = "dbo.IsUniqueUser";
    public const string SAVE_USER = "dbo.SaveUser";
    public const string SELECT_USER = "dbo.SelectUser";
    public const string SELECT_USER_BY_ID = "dbo.SelectUserById";
    public const string SELECT_USER_BY_EMAIL = "dbo.SelectUserByEmail";
    public const string SELECT_ROLE_BY_USER_ID = "dbo.SelectRoleByUserId";
    public const string DELETE_USER_BY_ID = "dbo.DeleteUserById";
    
    //Search
    public const string SEARCH_MAP_DATA = "dbo.SearchMapData";
    
    //Favourite
    public const string SAVE_FAVOURITE = "dbo.SaveFavourite";
}