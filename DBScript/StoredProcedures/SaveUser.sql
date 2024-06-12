
--region PROCEDURE [dbo].[SaveUser]
IF OBJECT_ID('[dbo].[SaveUser]') IS NOT NULL 
    BEGIN 
        DROP PROC [dbo].[SaveUser] 
    END 
GO 
     
CREATE PROC [dbo].[SaveUser] 
( 
	@Id INT, 
	@UserName NVARCHAR (50), 
	@FirstName NVARCHAR (50), 
	@LastName NVARCHAR (50), 
	@AspnetUserId NVARCHAR (450), 
	@UserTypeId INT,
	@Email NVARCHAR (50), 
	@PhoneNumber NVARCHAR (50), 
	@Active BIT 
)
AS
DECLARE @LocalId INT = @Id;
DECLARE @LocalUserName NVARCHAR (50) = LTRIM(RTRIM(@UserName));
DECLARE @LocalFirstName NVARCHAR (50) = LTRIM(RTRIM(@FirstName));
DECLARE @LocalLastName NVARCHAR (50) = LTRIM(RTRIM(@LastName));
DECLARE @LocalAspnetUserId NVARCHAR (450) = LTRIM(RTRIM(@AspnetUserId));
DECLARE @LocalUserTypeId INT = @UserTypeId;
DECLARE @LocalEmail NVARCHAR (50) = LTRIM(RTRIM(@Email));
DECLARE @LocalPhoneNumber NVARCHAR (50) = LTRIM(RTRIM(@PhoneNumber));
DECLARE @LocalActive BIT = @Active;

IF @LocalId IS NULL OR @LocalId = 0
BEGIN
	INSERT INTO [dbo].[User]
	([UserName], [FirstName], [LastName], [AspnetUserId], [UserTypeId], [Email], [PhoneNumber], [Active])
	SELECT @LocalUserName, @LocalFirstName, @LocalLastName, @LocalAspnetUserId, @LocalUserTypeId, @LocalEmail, @LocalPhoneNumber, @LocalActive
	SET @LocalId = SCOPE_IDENTITY()
END
ELSE
BEGIN
	UPDATE [dbo].[User]
	SET
		[UserName] = @LocalUserName, [FirstName] = @LocalFirstName, [LastName] = @LocalLastName, [AspnetUserId] = @LocalAspnetUserId, [UserTypeId] = @LocalUserTypeId, [Email] = @LocalEmail, [PhoneNumber] = @LocalPhoneNumber, [Active] = @LocalActive
		WHERE [Id] = @LocalId
END
SELECT @LocalId
GO
--endregion

