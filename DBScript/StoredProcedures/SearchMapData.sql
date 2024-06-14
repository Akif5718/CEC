--region PROCEDURE [dbo].[SearchMapData]
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
	@IsSchulsozialarbeit BIT
)
AS
BEGIN
	SET NOCOUNT ON
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	IF @IsSchulen = 1
	BEGIN
		SELECT * FROM [dbo].[Schulen]
	END
	ELSE
	BEGIN
		SELECT * FROM [dbo].[Schulen]
		WHERE 1<>1
	END

	IF @IsKindertageseinrichtungen = 1
	BEGIN
		SELECT * FROM [dbo].[Kindertageseinrichtungen]
	END
	ELSE
	BEGIN
		SELECT * FROM [dbo].[Kindertageseinrichtungen]
		WHERE 1<>1
	END

	IF @IsSchulsozialarbeit = 1
	BEGIN
		SELECT * FROM [dbo].[Schulsozialarbeit]
	END
	ELSE
	BEGIN
		SELECT * FROM [dbo].[Schulsozialarbeit]
		WHERE 1<>1
	END

	IF @IsJugendberufshilfen = 1
	BEGIN
		SELECT * FROM [dbo].[Jugendberufshilfen]
	END
	ELSE
	BEGIN
		SELECT * FROM [dbo].[Jugendberufshilfen]
		WHERE 1<>1
	END

	SET NOCOUNT OFF	END
GO
--endregion

