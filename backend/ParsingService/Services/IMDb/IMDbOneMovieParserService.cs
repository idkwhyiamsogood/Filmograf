using System.Text.RegularExpressions;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Microsoft.Playwright;

namespace Filmograf.ParsingService.Services.IMDb;

public class IMDbOneMovieParserService
{
    private static string GetFullQualityImageUrl(string? thumbUrl)
    {
        if (string.IsNullOrEmpty(thumbUrl)) return "Не найдена";
    
        // Ищем индекс начала параметров трансформации изображения
        int index = thumbUrl.IndexOf("._V1_");
        if (index != -1)
        {
            // Оставляем всё до ._V1_ и добавляем расширение
            return thumbUrl.Substring(0, index) + "._V1_.jpg";
        }
        return thumbUrl;
    }
    
    private static float ParseRating(string raw)
    {
        var match = Regex.Match(raw, @"[0-9](\.[0-9])?");
        return match.Success && float.TryParse(match.Value, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var result) 
            ? result 
            : 0f;
    }
    
    private static int ParseAgeLimit(string raw)
    {
        if (raw == "R") return 18;
        if (raw == "C") return 18;
        if (raw == "TV-MA") return 18;
        
        var match = Regex.Match(raw, @"\d+");
        return match.Success ? int.Parse(match.Value) : 0;
    }

    private static TimeOnly ParseDuration(string raw)
    {
        int hours = 0;
        int minutes = 0;

        var hMatch = Regex.Match(raw, @"(\d+)\s*[hч]");
        var mMatch = Regex.Match(raw, @"(\d+)\s*[mм]");

        if (hMatch.Success) hours = int.Parse(hMatch.Groups[1].Value);
        if (mMatch.Success) minutes = int.Parse(mMatch.Groups[1].Value);

        return new TimeOnly(Math.Min(hours, 23), Math.Min(minutes, 59));
    }

    private static async Task<RawMovieInfo> ExtractMovieDetailsAsync(IPage page, string url)
    {
        // Ожидаем загрузки основного блока с заголовком
        try
        {
            await page.WaitForSelectorAsync("[data-testid='hero__primary-text']", new PageWaitForSelectorOptions { Timeout = 15000 });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при ожидании заголовка фильма: {ex.Message}");
            throw new BadRequestHttpException("Не удалось загрузить детальную информацию о фильме.");
        }

        // 1. Название фильма
        var titleElement = await page.QuerySelectorAsync("[data-testid='hero__primary-text']");
        var title = titleElement != null ? await titleElement.InnerTextAsync() : "Не найдено";

        // 2. Оригинальное название (если есть)
        var originalTitleElement = await page.QuerySelectorAsync("div:has-text('Original title:')");
        var originalTitle = originalTitleElement != null ? (await originalTitleElement.InnerTextAsync()).Replace("Original title: ", "").Trim() : title;

        // 3. Рейтинг
        var ratingElement = await page.QuerySelectorAsync("[data-testid='hero-rating-bar__aggregate-rating__score'] > span:first-child");
        var ratingRaw = ratingElement != null ? await ratingElement.InnerTextAsync() : "0";
        var rating = ParseRating(ratingRaw);

        // 4. Метаданные (Год, Возраст, Время)
        // На IMDb они лежат в списке ul под заголовком
        var metadataItems = await page.QuerySelectorAllAsync("[data-testid='hero__pageTitle'] ~ ul.ipc-inline-list li");
        string year = "Не найден";
        int ageLimit = 0;
        TimeOnly duration = new TimeOnly(0, 0);

        if (metadataItems.Count > 0)
        {
            year = await metadataItems[0].InnerTextAsync();
            
            if (metadataItems.Count > 1)
            {
                if (metadataItems.Count >= 3)
                {
                    ageLimit = ParseAgeLimit(await metadataItems[1].InnerTextAsync());
                    duration = ParseDuration(await metadataItems[2].InnerTextAsync());
                }
                else
                {
                    var text = await metadataItems[1].InnerTextAsync();
                    if (text.Contains('h') || text.Contains('m'))
                        duration = ParseDuration(text);
                    else
                        ageLimit = ParseAgeLimit(text);
                }
            }
        }

        // 5. Описание (Сюжет)
        var plotElement = await page.QuerySelectorAsync("[data-testid='plot-xl']");
        if (plotElement == null) plotElement = await page.QuerySelectorAsync("[data-testid='plot-xs_to_m']"); // Фолбэк на мобильный/планшетный вид
        var description = plotElement != null ? await plotElement.InnerTextAsync() : string.Empty;

        // 6. Жанры
        var genres = new List<string>();
        var genreElements = await page.QuerySelectorAllAsync("[data-testid='interests'] .ipc-chip__text, [data-testid='genres'] .ipc-chip__text");
            
        foreach (var el in genreElements)
        {
            var text = await el.InnerTextAsync();
            if (!string.IsNullOrWhiteSpace(text)) genres.Add(text.Trim());
        }

        // 7. Постер
        string previewImageUrl = "Не найдена";
        var posterElement = await page.QuerySelectorAsync("[data-testid='hero-media__poster'] img");
        if (posterElement != null)
        {
            var src = await posterElement.GetAttributeAsync("src");
            if (!string.IsNullOrEmpty(src)) previewImageUrl = src;
        }

        // Возвращаем собранную модель
        return new RawMovieInfo
        {
            Name = title,
            Rate = rating,
            Year = year,
            AgeLimit = ageLimit,
            Time = duration,
            Description = description,
            Genres = genres,
            ImageUrl = GetFullQualityImageUrl(previewImageUrl),
            PreviewImageUrl = previewImageUrl,
            MovieLink = url,
            Source = "IMDb"
        };
    }

    public async Task<RawMovieInfo> ParseMovieFromPage(string url)
    {
        using var playwright = await Playwright.CreateAsync();
        
        // запуск браузера
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = true // Лучше использовать true, если вам не нужна визуальная отладка
        });
        
        await using var context = await browser.NewContextAsync(new BrowserNewContextOptions
        {
            ViewportSize = new ViewportSize { Width = 1920, Height = 1080 },
            UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" // Обновил версию Chrome на более свежую
        });
        
        IPage? page = null;
        try
        {
            // Используем ваш сервис для открытия страницы или стандартный метод
            // page = await PlaywrightService.ParsePageAsync(browser, context, url);
            
            // Если PlaywrightService недоступен в этом контексте, используйте:
            page = await context.NewPageAsync();
            var response = await page.GotoAsync(url, new PageGotoOptions { WaitUntil = WaitUntilState.DOMContentLoaded });
            
            if (page == null || (response != null && !response.Ok)) 
                throw new BadRequestHttpException($"Ошибка при загрузке страницы: {url}");

            // Извлекаем инфу о фильме
            var movieData = await ExtractMovieDetailsAsync(page, url);
            return movieData;
        }
        finally
        {
            if (page != null)
            {
                await page.CloseAsync();
            }
        }
    }
}