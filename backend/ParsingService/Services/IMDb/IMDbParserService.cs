using System.Text.RegularExpressions;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Microsoft.Playwright;

namespace Filmograf.ParsingService.Services.IMDb;

public class IMDbParserService
{
    private static float ParseRating(string raw)
    {
        var match = Regex.Match(raw, @"[0-9](\.[0-9])?");
        return match.Success && float.TryParse(match.Value, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var result) 
            ? result 
            : 0f;
    }
    
    // Вспомогательный метод для парсинга возраста (например, "18+", "R", "16")
    private static int ParseAgeLimit(string raw)
    {
        // Вытаскиваем только цифры. Если это "R" или "PG-13", вернет 0 или число.
        var match = Regex.Match(raw, @"\d+");
        return match.Success ? int.Parse(match.Value) : 0;
    }

    // Вспомогательный метод для парсинга времени (например, "2h 22m", "1h 30m", "45m")
    private static TimeOnly ParseDuration(string raw)
    {
        int hours = 0;
        int minutes = 0;

        var hMatch = Regex.Match(raw, @"(\d+)h");
        var mMatch = Regex.Match(raw, @"(\d+)m");

        if (hMatch.Success) hours = int.Parse(hMatch.Groups[1].Value);
        if (mMatch.Success) minutes = int.Parse(mMatch.Groups[1].Value);

        // TimeOnly требует корректные часы (0-23)
        return new TimeOnly(Math.Min(hours, 23), Math.Min(minutes, 59));
    }

    private static int? ParseChartIndex(string? raw)
    {
        if (raw == null) return null;
        return Int32.Parse(raw.Replace("#", ""));
    }

    private static async Task<IEnumerable<RawMovieInfo>> ExtractMoviesListAsync(IPage page)
    {
        // ожидание появления элементов с фильмами
        try
        {
            await page.WaitForSelectorAsync(".ipc-metadata-list-summary-item", new PageWaitForSelectorOptions
            { Timeout = 15000 });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при ожидании селектора .ipc-metadata-list-summary-item: {ex.Message}");
            // Попробуем альтернативный селектор
            try
            {
                await page.WaitForSelectorAsync("li.ipc-metadata-list-summary-item", new PageWaitForSelectorOptions
                { Timeout = 5000 });
            }
            catch
            {
                Console.WriteLine("Альтернативный селектор также не найден");
                throw new BadRequestHttpException("Не удалось найти элементы с фильмами на странице");
            }
        }

        // получение всех элементов с фильмами
        var movieElements = await page.QuerySelectorAllAsync(".ipc-metadata-list-summary-item");
        if (movieElements.Count == 0)
        {
            // Попробуем альтернативный селектор
            movieElements = await page.QuerySelectorAllAsync("li.ipc-metadata-list-summary-item");
        }
        
        Console.WriteLine($"Найдено фильмов: {movieElements.Count}");
        
        if (movieElements.Count == 0)
        {
            throw new BadRequestHttpException("Не найдено ни одного фильма на странице");
        }

        // извлечение данных о фильмах
        return await Task.WhenAll(movieElements.Select(async movieElement =>
        {
            // позиция в чарте (опционально)
            var chartIndexElement = await movieElement.QuerySelectorAsync(".ipc-signpost__text");
            var chartValueRaw = chartIndexElement != null ? await chartIndexElement.InnerTextAsync() : null;
            var chartValue = ParseChartIndex(chartValueRaw);
            
            // название фильма
            var titleElement = await movieElement.QuerySelectorAsync(".ipc-title__text");
            var title = titleElement != null ? await titleElement.InnerTextAsync() : "Не найдено";
            
            // рейтинг
            var ratingElement = await movieElement.QuerySelectorAsync(".ipc-rating-star");
            var ratingRaw = ratingElement != null ? await ratingElement.InnerTextAsync() : "0";
            var rating = ParseRating(ratingRaw);
            
            // метаданные (Год, Возраст, Время)
            var metadataItems = await movieElement.QuerySelectorAllAsync(".cli-title-metadata-item");
            
            string year = "Не найден";
            int ageLimit = 0;
            TimeOnly duration = new TimeOnly(0, 0);

            if (metadataItems.Count > 0)
            {
                year = await metadataItems[0].InnerTextAsync(); // Обычно первый - год
                
                if (metadataItems.Count > 1)
                {
                    if (metadataItems.Count == 3)
                    {
                        duration = ParseDuration(await metadataItems[1].InnerTextAsync());
                        ageLimit = ParseAgeLimit(await metadataItems[2].InnerTextAsync());
                    }
                    else
                    {
                        var text = await metadataItems[1].InnerTextAsync();
                        
                        // Проверяем, содержит ли текст "h" или "m" (признак времени)
                        if (text.Contains('h') || text.Contains('m'))
                            duration = ParseDuration(text);
                        else
                            ageLimit = ParseAgeLimit(text);
                    }
                }
            }
            
            // ссылка на картинку
            var imageUrl = await ExtractImageUrl(movieElement);
            
            // ссылка на страницу фильма
            var movieLink = await ExtractMovieLink(movieElement);
            
            return new RawMovieInfo
            {
                Name = title,
                Rate = rating,
                Year = year,
                AgeLimit = ageLimit,
                Time = duration,
                PreviewImageUrl = imageUrl,
                MovieLink = movieLink,
                Source = "IMDb",
                ChartIndex = chartValue 
            };
        }));
    }
    
    static async Task<string> ExtractImageUrl(IElementHandle movieElement)
    {
        try
        {
            // ищем изображение внутри постер-контейнера
            var imageElement = await movieElement.QuerySelectorAsync(".ipc-image");
            if (imageElement != null)
            {
                var src = await imageElement.GetAttributeAsync("src");
                if (!string.IsNullOrEmpty(src))
                {
                    return src;
                }
            }

            // альтернативный поиск через стили background-image
            var posterElement = await movieElement.QuerySelectorAsync(".ipc-media--poster-s");
            if (posterElement != null)
            {
                var style = await posterElement.GetAttributeAsync("style");
                if (!string.IsNullOrEmpty(style) && style.Contains("url("))
                {
                    var startIndex = style.IndexOf("url(") + 4;
                    var endIndex = style.IndexOf(")", startIndex);
                    if (endIndex > startIndex)
                    {
                        return style.Substring(startIndex, endIndex - startIndex).Trim('\'', '"');
                    }
                }
            }

            // еще один способ - через data-attributes
            var mediaElement = await movieElement.QuerySelectorAsync(".ipc-media");
            if (mediaElement != null)
            {
                var src = await mediaElement.GetAttributeAsync("src");
                if (!string.IsNullOrEmpty(src)) return src;
            }

            return "Не найдена";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при извлечении картинки: {ex.Message}");
            return "Ошибка";
        }
    }
    
    static async Task<string> ExtractMovieLink(IElementHandle movieElement)
    {
        try
        {
            // Ищем ссылку в заголовке
            var titleLink = await movieElement.QuerySelectorAsync(".ipc-title-link-wrapper");
            if (titleLink != null)
            {
                var href = await titleLink.GetAttributeAsync("href");
                if (!string.IsNullOrEmpty(href))
                {
                    return "https://www.imdb.com" + href;
                }
            }

            // Ищем ссылку в оверлее постера
            var overlayLink = await movieElement.QuerySelectorAsync(".ipc-lockup-overlay");
            if (overlayLink != null)
            {
                var href = await overlayLink.GetAttributeAsync("href");
                if (!string.IsNullOrEmpty(href))
                {
                    return "https://www.imdb.com" + href;
                }
            }

            return "Не найдена";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при извлечении ссылки: {ex.Message}");
            return "Ошибка";
        }
    }
    
    public async Task<IEnumerable<RawMovieInfo>> ParseMoviesFromPage(string url)
    {
        using var playwright = await Playwright.CreateAsync();
        
        // запуск браузера в headless режиме
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = false, // Режим без графического интерфейса
            // Args = new[] { "--no-sandbox", "--disable-dev-shm-usage" }
        });
        
        // создание контекста с настройками
        await using var context = await browser.NewContextAsync(new BrowserNewContextOptions
        {
            ViewportSize = new ViewportSize { Width = 1920, Height = 1080 },
            UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        });
        
        IPage? page = null;
        try
        {
            // сперва парсим основную страницу
            page = await PlaywrightService.ParsePageAsync(browser, context, url);
            if (page == null) throw new BadRequestHttpException("Ошибка при загрузке страницы");

            // извлекаем инфу о фильмах с этой страницы
            var moviesData = await ExtractMoviesListAsync(page);
            return moviesData;
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