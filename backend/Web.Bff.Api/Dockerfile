FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .


RUN dotnet restore Web.Bff.Api/Web.Bff.Api.csproj
RUN dotnet publish Web.Bff.Api/Web.Bff.Api.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /out .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Web.Bff.Api.dll"]
