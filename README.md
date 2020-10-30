# Todo App "inspired" by MS Todo :)

Subject: .NET 20.1A

# How to run the server

## Initiate database using migration

Run the following commands in exact order: 

 - This will install code generation tool

`dotnet tool install -g dotnet-aspnet-codegenerator`
 
 - This will init migrations
 
 `dotnet ef migrations add [name]`
 
 - This will apply migration configs (which located in the `Migrations` folder):
 
`dotnet ef database update`

## Drop database & Remove migrations

`dotnet ef database drop`

`dotnet ef migrations remove`