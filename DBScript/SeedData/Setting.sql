SET IDENTITY_INSERT [dbo].[Setting] ON 
--Clear first then insert all rows
DELETE FROM [dbo].[Setting] 
GO

-- USER TYPE
IF NOT EXISTS (SELECT * FROM [dbo].[Setting] WHERE SettingType = 'UserType' AND DisplayText = 'Admin')
	INSERT [dbo].[Setting] ([ID], [SettingType], [DisplayText]) VALUES (1,N'UserType',N'Admin')
GO
IF NOT EXISTS (SELECT * FROM [dbo].[Setting] WHERE SettingType = 'UserType' AND DisplayText = 'Customer')
	INSERT [dbo].[Setting] ([ID], [SettingType], [DisplayText]) VALUES (2,N'UserType',N'Customer')
GO