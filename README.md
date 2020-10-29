# Todo App "inspired" by MS Todo :)

Subject: .NET 20.1A

# How to run the server

## Initiate database using migration

Run the following commands in exact order: 

- This will install code generation tool

`dotnet tool install -g dotnet-aspnet-codegenerator`
 
 - This will apply migration configs (which located in the `Migrations` folder):
 
`dotnet ef migration update`

## Drop database

`dotnet ef migration drop`