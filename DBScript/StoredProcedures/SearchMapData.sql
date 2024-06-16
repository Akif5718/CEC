--region PROCEDURE [dbo].[SearchMapData] @IsJugendberufshilfen=0, @IsKindertageseinrichtungen=0,@IsSchulen=0,@IsSchulsozialarbeit=1, @IsFavourite=0, @UserId=3
IF OBJECT_ID('[dbo].[SearchMapData]') IS NOT NULL 
    BEGIN 
        DROP PROC [dbo].[SearchMapData] 
    END 
GO 
     
CREATE PROC [dbo].[SearchMapData] 
( 
	@IsJugendberufshilfen BIT,
	@IsKindertageseinrichtungen BIT,
	@IsSchulen BIT,
	@IsSchulsozialarbeit BIT,
	@IsFavourite BIT,
	@UserId INT
)
AS
BEGIN
	SET NOCOUNT ON
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	IF @IsFavourite = 1
	BEGIN
		IF @IsSchulen=0 AND @IsSchulsozialarbeit=0 AND @IsKindertageseinrichtungen=0 AND @IsJugendberufshilfen=0
		BEGIN
			SELECT [SCH].*, 1 AS IsFavourite
			FROM [dbo].[Favourite] AS [Fav]
			LEFT JOIN [dbo].[Schulen] AS [SCH] ON [Fav].CategoryId = [SCH].ID
			WHERE [Fav].UserId = @UserId AND [Fav].CategoryName = 'Schulen'

			SELECT [Kind].*, 1 AS IsFavourite
			FROM [dbo].[Favourite] AS [Fav]
			LEFT JOIN [dbo].[Kindertageseinrichtungen] AS [Kind] ON [Fav].CategoryId = [Kind].ID
			WHERE [Fav].UserId = @UserId AND [Fav].CategoryName = 'Kindertageseinrichtungen'

			SELECT [Sc].*, 1 AS IsFavourite
			FROM [dbo].[Favourite] AS [Fav]
			LEFT JOIN [dbo].[Schulsozialarbeit] AS [Sc] ON [Fav].CategoryId = [Sc].ID
			WHERE [Fav].UserId = @UserId AND [Fav].CategoryName = 'Schulsozialarbeit'

			SELECT [Jg].*, 1 AS IsFavourite
			FROM [dbo].[Favourite] AS [Fav]
			LEFT JOIN [dbo].[Jugendberufshilfen] AS [Jg] ON [Fav].CategoryId = [Jg].ID
			WHERE [Fav].UserId = @UserId AND [Fav].CategoryName = 'Jugendberufshilfen'
		END
		ELSE
		BEGIN
			IF @IsSchulen = 1
		BEGIN
			SELECT [SCH].*, 1 AS IsFavourite
			FROM [dbo].[Favourite] AS [Fav]
			LEFT JOIN [dbo].[Schulen] AS [SCH] ON [Fav].CategoryId = [SCH].ID
			WHERE [Fav].UserId = @UserId AND [Fav].CategoryName = 'Schulen'
		END
		ELSE
		BEGIN
			SELECT * FROM [dbo].[Schulen]
			WHERE 1<>1
		END

		IF @IsKindertageseinrichtungen = 1
		BEGIN
			SELECT [Kind].*, 1 AS IsFavourite
			FROM [dbo].[Favourite] AS [Fav]
			LEFT JOIN [dbo].[Kindertageseinrichtungen] AS [Kind] ON [Fav].CategoryId = [Kind].ID
			WHERE [Fav].UserId = @UserId AND [Fav].CategoryName = 'Kindertageseinrichtungen'
		END
		ELSE
		BEGIN
			SELECT * FROM [dbo].[Kindertageseinrichtungen]
			WHERE 1<>1
		END

		IF @IsSchulsozialarbeit = 1
		BEGIN
			SELECT [Sc].*, 1 AS IsFavourite
			FROM [dbo].[Favourite] AS [Fav]
			LEFT JOIN [dbo].[Schulsozialarbeit] AS [Sc] ON [Fav].CategoryId = [Sc].ID
			WHERE [Fav].UserId = @UserId AND [Fav].CategoryName = 'Schulsozialarbeit'
		END
		ELSE
		BEGIN
			SELECT * FROM [dbo].[Schulsozialarbeit]
			WHERE 1<>1
		END

		IF @IsJugendberufshilfen = 1
		BEGIN
			SELECT [Jg].*, 1 AS IsFavourite
			FROM [dbo].[Favourite] AS [Fav]
			LEFT JOIN [dbo].[Jugendberufshilfen] AS [Jg] ON [Fav].CategoryId = [Jg].ID
			WHERE [Fav].UserId = @UserId AND [Fav].CategoryName = 'Jugendberufshilfen'
		END
		ELSE
		BEGIN
			SELECT * FROM [dbo].[Jugendberufshilfen]
			WHERE 1<>1
		END
		END
		
	END
	ELSE
	BEGIN
		IF @IsSchulen = 1
		BEGIN
			SELECT [SCH].* ,
			CASE
				WHEN (SELECT TOP(1) 1 FROM dbo.[Favourite] WHERE UserId = @UserId AND CategoryId = [SCH].ID AND CategoryName = 'Schulen') = 1 THEN 1
				ELSE 0
			END AS IsFavourite
			FROM [dbo].[Schulen] AS [SCH]
		END
		ELSE
		BEGIN
			SELECT * FROM [dbo].[Schulen]
			WHERE 1<>1
		END

		IF @IsKindertageseinrichtungen = 1
		BEGIN
			SELECT [Kind].* ,
			CASE
				WHEN (SELECT TOP(1) 1 FROM dbo.[Favourite] WHERE UserId = @UserId AND CategoryId = [Kind].ID AND CategoryName = 'Kindertageseinrichtungen') = 1 THEN 1
				ELSE 0
			END AS IsFavourite
			FROM [dbo].[Kindertageseinrichtungen] AS [Kind]
		END
		ELSE
		BEGIN
			SELECT * FROM [dbo].[Kindertageseinrichtungen]
			WHERE 1<>1
		END

		IF @IsSchulsozialarbeit = 1
		BEGIN
			SELECT [SC].* ,
			CASE
				WHEN (SELECT TOP(1) 1 FROM dbo.[Favourite] WHERE UserId = @UserId AND CategoryId = [SC].ID AND CategoryName = 'Schulsozialarbeit') = 1 THEN 1
				ELSE 0
			END AS IsFavourite
			FROM [dbo].[Schulsozialarbeit] AS [SC]
		END
		ELSE
		BEGIN
			SELECT * FROM [dbo].[Schulsozialarbeit]
			WHERE 1<>1
		END

		IF @IsJugendberufshilfen = 1
		BEGIN
			SELECT [Jg].* ,
			CASE
				WHEN (SELECT TOP(1) 1 FROM dbo.[Favourite] WHERE UserId = @UserId AND CategoryId = [Jg].ID AND CategoryName = 'Jugendberufshilfen') = 1 THEN 1
				ELSE 0
			END AS IsFavourite
			FROM [dbo].[Jugendberufshilfen] AS [Jg]
		END
		ELSE
		BEGIN
			SELECT * FROM [dbo].[Jugendberufshilfen]
			WHERE 1<>1
		END
	END

	

	SET NOCOUNT OFF	END
GO
--endregion
