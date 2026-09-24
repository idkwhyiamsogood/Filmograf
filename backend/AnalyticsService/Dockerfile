# ЭТАП СБОРКИ
# Контекст сборки — папка backend (см. docker-compose.yml), чтобы был доступен BaseLibrary
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Сначала только csproj — чтобы restore кэшировался между сборками
COPY BaseLibrary/BaseLibrary.csproj BaseLibrary/
COPY AnalyticsService/AnalyticsService.csproj AnalyticsService/
RUN dotnet restore "AnalyticsService/AnalyticsService.csproj"

# Затем исходники
COPY BaseLibrary/ BaseLibrary/
COPY AnalyticsService/ AnalyticsService/
RUN dotnet publish "AnalyticsService/AnalyticsService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --no-restore

# ФИНАЛЬНЫЙ ЭТАП
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# env.json в образ не попадает — пробрасывается через volumes в docker-compose.yml:
# /shared/env.json <- shared/env.docker.json (общий, читается как ../shared/env.json)
# /app/env.json    <- <Service>/env.json      (локальный, если он есть у сервиса)
EXPOSE 8080
ENTRYPOINT ["dotnet", "Filmograf.AnalyticsService.dll"]
