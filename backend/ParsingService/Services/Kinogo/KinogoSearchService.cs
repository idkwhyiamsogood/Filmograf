using System.Text.RegularExpressions;
using System.Web;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Microsoft.Playwright;

namespace Filmograf.ParsingService.Services.Kinogo;

public class KinogoSearchService
{
    public async Task<IEnumerable<RawMovieInfo>> SearchMoviesAsync(string query)
    {
        string encodedQuery = HttpUtility.UrlEncode(query);
        string url = $"https://kinogo.jp/index.php?do=search&subaction=search&search_start=0&full_search=0&story={encodedQuery}";

        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = true });
        await using var context = await browser.NewContextAsync();
        
        var page = await context.NewPageAsync();
        var response = await page.GotoAsync(url, new PageGotoOptions { WaitUntil = WaitUntilState.DOMContentLoaded });

        if (response == null || !response.Ok)
            throw new BadRequestHttpException("Не удалось загрузить страницу Kinogo");

        // Теперь используем новый селектор карточек
        var cardElements = await page.QuerySelectorAllAsync("article.card");
        var results = new List<RawMovieInfo>();

        foreach (var card in cardElements)
        {
            // 1. Название и Ссылка (MovieLink оставляем пустым по ТЗ, но берем заголовок)
            var titleAnchor = await card.QuerySelectorAsync(".card__title a");
            var fullName = titleAnchor != null ? (await titleAnchor.InnerTextAsync()).Trim() : "";
            
            // Чистим название от года в скобках, если нужно, или оставляем как есть
            var name = Regex.Replace(fullName, @"\s*\(\d{4}\)$", "").Trim();

            // 2. Описание
            var descElement = await card.QuerySelectorAsync(".card__text");
            var description = descElement != null ? (await descElement.InnerTextAsync()).Trim() : null;

            // 3. Картинка (одинаковая для обоих полей по ТЗ)
            var imgElement = await card.QuerySelectorAsync(".card__img img");
            var imgSrc = imgElement != null ? await imgElement.GetAttributeAsync("src") : null;
            if (imgSrc != null && imgSrc.StartsWith("/")) imgSrc = "https://kinogo.jp" + imgSrc;

            // 4. Рейтинг Кинопоиска (ищем именно в блоке .kp)
            var kpRatingElement = await card.QuerySelectorAsync(".card__rating-ext.imdb");
            float rate = 0;
            if (kpRatingElement != null)
            {
                var kpText = await kpRatingElement.InnerTextAsync();
                // Извлекаем число (может быть 7.984 или 7.9)
                var match = Regex.Match(kpText, @"(\d+(\.\d+)?)");
                if (match.Success) 
                    float.TryParse(match.Groups[1].Value, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out rate);
            }

            // 5. Данные из списка характеристик (Год, Жанры, Время)
            var listItems = await card.QuerySelectorAllAsync(".card__list li");
            string year = "0";
            var genres = new List<string>();
            TimeOnly duration = new TimeOnly(0, 0);

            foreach (var li in listItems)
            {
                var text = await li.InnerTextAsync();
                if (text.Contains("Год выпуска:")) 
                    year = text.Replace("Год выпуска:", "").Trim();
                
                else if (text.Contains("Жанр:"))
                    genres = text.Replace("Жанр:", "").Split(',').Select(g => g.Trim()).ToList();
                
                else if (text.Contains("Продолжительность:"))
                {
                    var timeStr = text.Replace("Продолжительность:", "").Trim();
                    TimeOnly.TryParse(timeStr, out duration);
                }
            }

            results.Add(new RawMovieInfo
            {
                Source = "IMDb",
                Name = name,
                Description = description,
                Year = year,
                AgeLimit = 0,
                Time = duration,
                ImageUrl = imgSrc,
                PreviewImageUrl = imgSrc,
                MovieLink = "", // По ТЗ пустой
                Rate = rate,
                Genres = genres
            });
        }

        return results;
    }
}