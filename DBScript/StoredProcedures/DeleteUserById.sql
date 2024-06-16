--region PROCEDURE [dbo].[DeleteUserById] 2
IF OBJECT_ID('[dbo].[DeleteUserById]') IS NOT NULL 
    BEGIN 
        DROP PROC [dbo].[DeleteUserById] 
    END 
GO 
     
CREATE PROC [dbo].[DeleteUserById] 
( 
	@UserId INT
)
AS
	UPDATE [dbo].[User] 
	SET Active = 0
	WHERE Id = @UserId
GO
--endregion

