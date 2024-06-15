--region PROCEDURE [dbo].[SelectUserById] 2
IF OBJECT_ID('[dbo].[SelectUserById]') IS NOT NULL 
    BEGIN 
        DROP PROC [dbo].[SelectUserById] 
    END 
GO 
     
CREATE PROC [dbo].[SelectUserById] 
( 
	@Id INT
)
AS
	SELECT
	[U].[Id],
	[U].[UserName],
	[U].[FirstName],
	[U].[LastName],
	[U].[AspnetUserId],
	[U].[UserTypeId],
	[U].[Email],
	[U].[PhoneNumber],
	[U].[Active],
	[H].[X],
	[H].[Y]
	FROM [dbo].[User] AS [U]
	INNER JOIN [dbo].[Home] AS [H] ON [H].UserId = [U].Id
	WHERE [U].Id=@Id
GO
--endregion

