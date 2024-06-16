IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Favourite]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Favourite](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CategoryName] NVARCHAR(50) NOT NULL,
	[CategoryId] VARCHAR(MAX) NOT NULL,
	[UserId] INT NOT NULL CONSTRAINT FK_Favourite_User REFERENCES dbo.[User](Id),
	CONSTRAINT PK_FavouriteID PRIMARY KEY (Id)
)
END
GO