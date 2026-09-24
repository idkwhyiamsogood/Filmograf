# ЭТАП СБОРКИ
# Контекст сборки — папка backend (см. docker-compose.yml), чтобы был доступен BaseLibrary
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Сначала только csproj — чтобы restore кэшировался между сборками
COPY BaseLibrary/BaseLibrary.csproj BaseLibrary/
COPY ParsingService/ParsingService.csproj ParsingService/
RUN dotnet restore "ParsingService/ParsingService.csproj"

# Затем исходники
COPY BaseLibrary/ BaseLibrary/
COPY ParsingService/ ParsingService/
RUN dotnet publish "ParsingService/ParsingService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --no-restore

# ФИНАЛЬНЫЙ ЭТАП
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Ставим headless Chromium + системные зависимости через node-драйвер Playwright,
# который Microsoft.Playwright кладёт в publish (.playwright/). Отдельный pwsh не нужен.
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN ARCH=$(dpkg --print-architecture | sed 's/amd64/x64/') \
    && ./.playwright/node/linux-$ARCH/node ./.playwright/package/cli.js install --with-deps --only-shell chromium \
    && rm -rf /var/lib/apt/lists/*

# env.json в образ не попадает — пробрасывается через volumes в docker-compose.yml:
# /shared/env.json <- shared/env.docker.json (читается как ../shared/env.json)
EXPOSE 8080
ENTRYPOINT ["dotnet", "Filmograf.ParsingService.dll"]
