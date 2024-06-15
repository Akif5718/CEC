IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Home]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Home](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] INT NOT NULL CONSTRAINT FK_Home_User REFERENCES dbo.[User](Id),
	[X] FLOAT NULL,
	[Y] FLOAT NULL,
	CONSTRAINT PK_HomeID PRIMARY KEY (Id)
)
END
GO