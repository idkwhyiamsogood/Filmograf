# ЭТАП СБОРКИ
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Копируем всё и сразу восстанавливаем
COPY . .
WORKDIR "/src/AuthService"
RUN dotnet restore
RUN dotnet publish -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# ФИНАЛЬНЫЙ ЭТАП
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

RUN ls -la /app

ENTRYPOINT ["dotnet", "AuthService.dll"]