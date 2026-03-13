using System.Globalization;
using System.Text.RegularExpressions;
using Filmograf.BaseLibrary.Models.Types;
using Microsoft.Playwright;

namespace Filmograf.ParsingService.Services.Kinopoisk;

public class KinopoiskParserService
{
    public async Task<IEnumerable<RawMovieInfo>> ParseMoviesFromPage(string url)
    {
        using var playwright = await Playwright.CreateAsync();
        
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = false, // Пока false для отладки
        });
        
        await using var context = await browser.NewContextAsync(new BrowserNewContextOptions
        {
            ViewportSize = new ViewportSize { Width = 1920, Height = 1080 },
            UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        });

        var page = await context.NewPageAsync();
        
        // Переходим на страницу и ждем загрузки сети
        await page.GotoAsync(url, new PageGotoOptions { WaitUntil = WaitUntilState.NetworkIdle });
        
        // Скроллим вниз, чтобы подгрузились картинки (lazy-load)
        await page.EvaluateAsync("window.scrollTo(0, document.body.scrollHeight)");
        await page.WaitForTimeoutAsync(2000); // Даем время на подгрузку DOM и картинок

        var movies = await ExtractMoviesListAsync(page);
        
        return movies;
    }

    private static async Task<IEnumerable<RawMovieInfo>> ExtractMoviesListAsync(IPage page)
    {
        var moviesList = new List<RawMovieInfo>();

        // Ждем появления первого элемента списка, чтобы убедиться, что контент загружен
        await page.WaitForSelectorAsync("div[data-test-id='movie-list-item']");
        var movieElements = await page.Locator("div[data-test-id='movie-list-item']").AllAsync();

        foreach (var element in movieElements)
        {
            var movie = new RawMovieInfo
            {
                Source = "Kinopoisk"
            };

            // Место в топе
            var indexStr = await element.Locator(".styles_position__nfMVF").InnerTextAsync();
            if (int.TryParse(indexStr, out int index))
                movie.ChartIndex = index;

            // Название
            movie.Name = await element.Locator(".styles_mainTitle__RHG2S").InnerTextAsync();

            // Ссылка
            var linkPath = await element.Locator("a.base-movie-main-info_link__K161e").GetAttributeAsync("href");
            movie.MovieLink = string.IsNullOrEmpty(linkPath) ? null : $"https://www.kinopoisk.ru{linkPath}";

            // Картинка (добавляем "https:" если ссылка начинается с "//")
            var imgSrc = await element.Locator("img.styles_image__G7AJm").GetAttributeAsync("src");
            movie.PreviewImageUrl = string.IsNullOrEmpty(imgSrc) ? null : (imgSrc.StartsWith("//") ? $"https:{imgSrc}" : imgSrc);
            // ImageUrl можно оставить таким же или парсить high-res из srcset, если нужно
            movie.ImageUrl = movie.PreviewImageUrl;

            // Оценка
            var rateStr = await element.Locator(".styles_kinopoiskValue__wuWe_").InnerTextAsync();
            if (!string.IsNullOrEmpty(rateStr) && float.TryParse(rateStr.Replace(",", "."), NumberStyles.Float, CultureInfo.InvariantCulture, out float rate))
                movie.Rate = rate;

            // Год и время (текст формата: ", 2014, 2 ч 49 мин")
            var secondaryText = await element.Locator(".desktop-list-main-info_secondaryText__gwhDJ").InnerTextAsync();
            if (!string.IsNullOrEmpty(secondaryText))
            {
                var parts = secondaryText.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                if (parts.Length > 0)
                {
                    movie.Year = parts[0].Trim(); // В некоторых случаях тут может остаться мусор вроде , можно почистить регекспом
                    movie.Year = Regex.Replace(movie.Year, @"[^\d]", ""); // Оставляем только цифры года
                }
                if (parts.Length > 1)
                {
                    movie.Time = ParseTimeOnly(parts[1]);
                }
            }

            // Жанры, Страна, Режиссер (текст формата: "США • фантастика  Режиссёр: Кристофер Нолан")
            var additionalInfoElements = await element.Locator(".desktop-list-main-info_truncatedText__DAuwA").AllInnerTextsAsync();
            if (additionalInfoElements.Any())
            {
                var firstLine = additionalInfoElements[0]; // "США • фантастика  Режиссёр: Кристофер Нолан"
                movie.Description = string.Join("\n", additionalInfoElements); // Сохраняем всю инфу в описание на всякий случай

                // Парсинг жанра
                var splitByDot = firstLine.Split('•');
                if (splitByDot.Length > 1)
                {
                    var genrePart = splitByDot[1].Split("Режиссёр:")[0].Trim(); // вытягиваем "фантастика"
                    movie.Genres = genrePart.Split(',').Select(g => g.Trim()).ToList();
                }
            }
            
            // AgeLimit (Возрастное ограничение не всегда есть в карточке списка, ставим дефолт или ищем, если добавится селектор)
            movie.AgeLimit = 0; 

            moviesList.Add(movie);
        }

        return moviesList;
    }

    // Вспомогательный метод для парсинга "2 ч 49 мин" или "1 ч" или "45 мин" в TimeOnly
    private static TimeOnly ParseTimeOnly(string timeString)
    {
        int hours = 0;
        int minutes = 0;

        var hoursMatch = Regex.Match(timeString, @"(\d+)\s*ч");
        if (hoursMatch.Success)
            hours = int.Parse(hoursMatch.Groups[1].Value);

        var minutesMatch = Regex.Match(timeString, @"(\d+)\s*мин");
        if (minutesMatch.Success)
            minutes = int.Parse(minutesMatch.Groups[1].Value);

        // Защита от кривых данных, если фильм идет больше 23 часов (что вряд ли, но TimeOnly упадет с ошибкой)
        if (hours > 23) 
            return new TimeOnly(23, 59);

        return new TimeOnly(hours, minutes);
    }
}