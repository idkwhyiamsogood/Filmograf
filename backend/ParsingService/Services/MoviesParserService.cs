using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Microsoft.Playwright;

namespace ParsingService.Services;

public class MoviesParserService
{
    private static async Task<IEnumerable<Movie>> ExtractMoviesListAsync(IPage page)
    {
        // ожидание появления элементов с фильмами
        try
        {
            await page.WaitForSelectorAsync(".ipc-metadata-list-summary-item", new PageWaitForSelectorOptions
            {
                Timeout = 15000
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при ожидании селектора .ipc-metadata-list-summary-item: {ex.Message}");
            // Попробуем альтернативный селектор
            try
            {
                await page.WaitForSelectorAsync("li.ipc-metadata-list-summary-item", new PageWaitForSelectorOptions
                {
                    Timeout = 5000
                });
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
            // название фильма
            var titleElement = await movieElement.QuerySelectorAsync(".ipc-title__text");
            var title = titleElement != null ? await titleElement.InnerTextAsync() : "Не найдено";
            
            // рейтинг
            var ratingElement = await movieElement.QuerySelectorAsync(".ipc-rating-star");
            var rating = ratingElement != null ? await ratingElement.InnerTextAsync() : "Не найден";
            
            // год
            var yearElement = await movieElement.QuerySelectorAsync(".cli-title-metadata-item");
            var year = yearElement != null ? await yearElement.InnerTextAsync() : "Не найден";
            
            // ссылка на картинку
            var imageUrl = await ExtractImageUrl(movieElement);
            
            // ссылка на страницу фильма
            var movieLink = await ExtractMovieLink(movieElement);
            
            return new Movie
            {
                Title = title,
                Rating = rating,
                Year = year,
                ImageUrl = imageUrl,
                MovieLink = movieLink
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
    
    public static async Task<List<Movie>> ParseMoviesFromPage(string url)
    {
        using var playwright = await Playwright.CreateAsync();
        
        // запуск браузера в headless режиме
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = true, // Режим без графического интерфейса
            Args = new[] { "--no-sandbox", "--disable-dev-shm-usage" }
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
            return moviesData.ToList();
        }
        finally
        {
            if (page != null)
            {
                await page.CloseAsync();
            }
        }
    }

    private async Task<Movie> ExtractMovieAsync(IPage page)
    {
        throw new NotImplementedException();
    }
    
    public static async Task<Movie> ParseMovieFromPage()
    {
        throw new NotImplementedException();
    }
}