
--region PROCEDURE [dbo].[SaveFavourite]
IF OBJECT_ID('[dbo].[SaveFavourite]') IS NOT NULL 
    BEGIN 
        DROP PROC [dbo].[SaveFavourite] 
    END 
GO 
     
CREATE PROC [dbo].[SaveFavourite] 
( 
	@UserId INT, 
	@CategoryId VARCHAR (MAX), 
	@CategoryName NVARCHAR (50), 
	@IsFavourite BIT
)
AS
DECLARE @LocalUserId INT = @UserId;
DECLARE @LocalCategoryName NVARCHAR (50) = LTRIM(RTRIM(@CategoryName));
DECLARE @LocalCategoryId VARCHAR (MAX) = LTRIM(RTRIM(@CategoryId));
DECLARE @LocalIsFavourite BIT = @IsFavourite;


IF @LocalIsFavourite = 1
BEGIN
	IF NOT EXISTS (SELECT 1 FROM dbo.[Favourite] WHERE UserId = @LocalUserId AND CategoryId = @LocalCategoryId AND CategoryName = @LocalCategoryName)
	BEGIN
		INSERT INTO [dbo].[Favourite]
		(UserId,CategoryId,CategoryName)
		SELECT @LocalUserId, @LocalCategoryId, @LocalCategoryName
	END
END
ELSE
BEGIN
	IF EXISTS (SELECT 1 FROM dbo.[Favourite] WHERE UserId = @LocalUserId AND CategoryId = @LocalCategoryId AND CategoryName = @LocalCategoryName)
	BEGIN
		DELETE [dbo].[Favourite]
		WHERE UserId = @LocalUserId AND CategoryId = @LocalCategoryId AND CategoryName = @LocalCategoryName
	END
END
GO
--endregion

