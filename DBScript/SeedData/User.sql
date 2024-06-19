-- Admin user
IF NOT EXISTS (SELECT * FROM [dbo].[User] WHERE UserName = 'admin')
	INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], 
		[ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) 
			VALUES (NEWID(), 'admin', 'ADMIN', 'admin@email.com', 'admin@email.com',0, N'AQAAAAEAACcQAAAAEFiolsagS+hYjesoyJAdare/AdNxkYm62MUdJil0ivIjoPrOwa8JXlmygF8SVxnUJw==', N'VWL3BW4JD4VCXMY2QNLSX255DFHQTGW4', 
			N'08f47001-ebb6-43a4-aaef-a3f9580d03dc', NULL, 0, 0, NULL, 1, 0)
	INSERT [dbo].[User] (UserName,FirstName,LastName,AspnetUserId,UserTypeId,Email,PhoneNumber,Active)
	VALUES ('admin','Admin','Admin',(SELECT Id from  [dbo].[AspNetUsers]  WHERE [UserName] = 'admin'),1,'admin@email.com','',1)
GO