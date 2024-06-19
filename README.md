# BinaryHire Project Setup Guide

## Frontend (React Version 18.2)

1. **Node Version: 20.11**

   Open terminal and navigate to the CEC.ClientApp folder.

2. **Install Dependencies:**

```powershell
npm install
```

3. **Run Development Server:**

```powershell
npm run dev
```

## Database

1. **Navigate to the DBScript folder.**

2. **Modify `DatabaseDeployment.ps1` with any text editor.**

3. **Change the following variables according to your setup:**

```powershell
$ServerInstance = "(local)"
$UserName = "sa"
$UserPassword = "password"
```

4. **Run the modified file with PowerShell.**
5. **Default Admin User will be: UserName:"admin", Password:"Test@123"**

## Backend API (Dotnet Core 6)

1. **Install .NET Core Runtime and SDK.**

2. **Navigate to the CEC.API folder.**

3. **Modify appsettings.json with any text editor.**

4. **Change the 'ConnectionStrings'**

```powershell
"ConnectionStrings": {
    "BHDB": "connection string"
}
```

5. **Build and Run the Dotnet Core API:**

```powershell
dotnet run
```
