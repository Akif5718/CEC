$ServerInstance = "(local)"
$UserName = "sa"
$UserPassword = "orion123@"
$DeploymentVersion = "1.0"
$DatabaseName = "CECDB";

$OS = [System.Environment]::OSVersion.Platform;
$iswindows = $true; 
if($OS -ne "Win32NT")
{
    $iswindows = $false;
}
Try
{
    $Query = "IF NOT EXISTS (SELECT
			*
		FROM sys.databases
		WHERE name = '$DatabaseName')
BEGIN
	CREATE DATABASE $DatabaseName
END
GO"
    if($iswindows)
    {
        Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database master -QueryTimeout 65535 -Query $Query 
    }
    else
    {
        Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database master -QueryTimeout 65535 -TrustServerCertificate -Query $Query 
    }
    Write-Host "Database $DatabaseName will be crerated if it does not exist.";
}
Catch
{
    Write-Host -ForegroundColor Red 'Error occured while executing query'
    Write-Host -ForegroundColor Red $_.Exception.Message
}



$ScriptsRoot = "$PSScriptRoot";
$ExecutionOrderList = $ScriptsRoot + '\execute-order-list-' + $DeploymentVersion + '.txt';
$ExecutionOrderListPath = Resolve-Path $ExecutionOrderList
$ExecutionOrderListLines = Get-Content $ExecutionOrderListPath

Foreach ($Line in $ExecutionOrderListLines)
{
    if($Line.Trim().StartsWith('#') -or $Line.Trim() -eq '')
    {
        continue;
    }
    $FilePath = Resolve-Path $ScriptsRoot\$Line
    Write-Host 'Executing: ' $FilePath.ToString();
    Try
    {
        if($iswindows)
        {
            Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -QueryTimeout 65535 -InputFile $FilePath.ToString()
        }
        else 
        {
            Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -TrustServerCertificate -QueryTimeout 65535 -InputFile $FilePath.ToString()
        }
	    Write-Host 'Execution complete'
    }
    Catch
    {
        Write-Host -ForegroundColor Red 'Error occured while executing script : ' + $FilePath.ToString()
        Write-Host -ForegroundColor Red $_.Exception.Message
    }
}


# update deployment history table
Try
{
    $Query = "
    IF OBJECT_ID(N'[dbo].[DBDeploymentHistory]', N'U') IS NULL
    BEGIN
        CREATE TABLE [dbo].[DBDeploymentHistory]
        (
	        [IID] INT IDENTITY (1,1) PRIMARY KEY,
	        [Version] VARCHAR(32) NOT NULL,
	        [DeployFileName] VARCHAR(4096) NOT NULL,
            [HostName] VARCHAR(1024) NULL,
	        [CreatedDate] DATETIME NOT NULL DEFAULT (GETDATE()),
	        [CreatedBy] VARCHAR(50) NOT NULL
        )
    END;"
    
    if($iswindows)
    {
        Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -QueryTimeout 65535 -Query $Query
    }
    else 
    {
        Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -TrustServerCertificate -QueryTimeout 65535 -Query $Query
    }
    Write-Host 'Deployment History table will be created if it does not exist'

    $Query = "
    IF OBJECT_ID(N'[dbo].[DBDeploymentHistory]', N'U') IS NOT NULL
    BEGIN
        INSERT INTO [dbo].[DBDeploymentHistory]
           ([Version]
           ,[DeployFileName]
           ,[HostName]
           ,[CreatedDate]
           ,[CreatedBy])
     VALUES
           ('$DeploymentVersion'
           ,'$PSCommandPath'
           ,'$env:COMPUTERNAME'
           ,GETDATE()
           ,'$UserName')
    END;"
    
    if($iswindows)
    {
        Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -QueryTimeout 65535 -Query $Query
    }
    else 
    {
        Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -TrustServerCertificate -QueryTimeout 65535 -Query $Query
    }
    Write-Host 'Deployment history updated'
}
Catch
{
    Write-Host -ForegroundColor Red 'Error occured while updating deployment history.'
    Write-Host -ForegroundColor Red $_.Exception.Message
}

# Adding tables from CSV files if they don't already exist
$CsvFolder = "$PSScriptRoot\csv-files"
$CsvFiles = Get-ChildItem -Path $CsvFolder -Filter *.csv

foreach ($CsvFile in $CsvFiles) {
    $TableName = [System.IO.Path]::GetFileNameWithoutExtension($CsvFile.Name)
    $CsvContent = Import-Csv -Path $CsvFile.FullName
    $Columns = $CsvContent | Get-Member -MemberType Properties | Select-Object -ExpandProperty Name
    $ColumnDefinitionsArray = @()
    foreach ($Column in $Columns) {
        $ColumnDefinitionsArray += "$Column VARCHAR(MAX)"
    }
    $ColumnDefinitions = $ColumnDefinitionsArray -join ", "

    # Check if table exists and has data
    $CheckTableQuery = @"
    IF OBJECT_ID(N'[dbo].[$TableName]', N'U') IS NOT NULL
    BEGIN
        IF EXISTS (SELECT 1 FROM [dbo].[$TableName])
            SELECT 1 AS TableExists
        ELSE
            SELECT 0 AS TableExists
    END
    ELSE
        SELECT 0 AS TableExists
"@
    $TableExists = 0
    Try {
        if ($iswindows) {
            $TableExists = Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -QueryTimeout 65535 -Query $CheckTableQuery | Select-Object -ExpandProperty TableExists
        } else {
            $TableExists = Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -TrustServerCertificate -QueryTimeout 65535 -Query $CheckTableQuery | Select-Object -ExpandProperty TableExists
        }
    } Catch {
        Write-Host -ForegroundColor Red "Error occurred while checking if table [$TableName] exists."
        Write-Host -ForegroundColor Red $_.Exception.Message
        continue
    }

    if ($TableExists -eq 0) {
        # Create table query
        $CreateTableQuery = "IF OBJECT_ID(N'[dbo].[$TableName]', N'U') IS NULL BEGIN CREATE TABLE [dbo].[$TableName] ($ColumnDefinitions) END;"
        Try {
            if ($iswindows) {
                Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -QueryTimeout 65535 -Query $CreateTableQuery
            } else {
                Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -TrustServerCertificate -QueryTimeout 65535 -Query $CreateTableQuery
            }
            Write-Host "Table [$TableName] created or already exists."
        } Catch {
            Write-Host -ForegroundColor Red "Error occurred while creating table [$TableName]."
            Write-Host -ForegroundColor Red $_.Exception.Message
            continue
        }

        # Insert data into the table
        foreach ($Row in $CsvContent) {
            $ColumnNames = $Columns -join ", "
            $ColumnValuesArray = @()
            foreach ($Column in $Columns) {
                $ColumnValuesArray += "'" + ($Row.$Column -replace "'", "''") + "'"
            }
            $ColumnValues = $ColumnValuesArray -join ", "
            $InsertQuery = "INSERT INTO [dbo].[$TableName] ($ColumnNames) VALUES ($ColumnValues);"
            Try {
                if ($iswindows) {
                    Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -QueryTimeout 65535 -Query $InsertQuery
                } else {
                    Invoke-Sqlcmd -ServerInstance $ServerInstance -Username $UserName -Password $UserPassword -Database $DatabaseName -TrustServerCertificate -QueryTimeout 65535 -Query $InsertQuery
                }
                Write-Host "Data inserted into [$TableName]."
            } Catch {
                Write-Host -ForegroundColor Red "Error occurred while inserting data into [$TableName]."
                Write-Host -ForegroundColor Red $_.Exception.Message
            }
        }
    } else {
        Write-Host "Table [$TableName] already exists and contains data. Skipping creation and data insertion."
    }
}