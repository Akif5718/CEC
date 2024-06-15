
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
	@Active BIT,
	@X FLOAT,
	@Y FLOAT 
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

IF @X IS NOT NULL AND @Y IS NOT NULL
    BEGIN
        IF EXISTS (SELECT 1 FROM dbo.[Home] WHERE UserId = @LocalId)
        BEGIN
            UPDATE dbo.[Home]
            SET X = @X, Y = @Y
            WHERE UserId = @LocalId;
        END
        ELSE
        BEGIN
            INSERT INTO dbo.[Home] (UserId, X, Y)
            VALUES (@LocalId, @X, @Y);
        END
    END
SELECT @LocalId
GO
--endregion

