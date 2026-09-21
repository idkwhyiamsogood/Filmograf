using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Models.Types;
using Microsoft.Playwright;

namespace Filmograf.ParsingService.Services.IMDb;

public class IMDbDetailsParserService
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
    
    private static async Task<MovieDetailsParseResult?> GetMovieDetailsAsync(IPage page, MovieRepo info)
    {
        try
        {
            // URL постера прямо со страницы
            var posterElement = await page.QuerySelectorAsync("[data-testid='hero-media__poster'] img.ipc-image");
            if (posterElement != null)
            {
                var src = await posterElement.GetAttributeAsync("src");
                if (!string.IsNullOrEmpty(src)) info.PreviewImageUrl = src;
            }
            
            // жанры (по чипам/тегам)
            var genres = new List<string>();
            var genreElements = await page.QuerySelectorAllAsync("[data-testid='interests'] .ipc-chip__text, [data-testid='genres'] .ipc-chip__text");
            
            foreach (var el in genreElements)
            {
                var text = await el.InnerTextAsync();
                if (!string.IsNullOrWhiteSpace(text)) genres.Add(text.Trim());
            }

            // описание 
            string description = "Описание не найдено";
            var plotElement = await page.QuerySelectorAsync("[data-testid='plot-xl']");
            if (plotElement == null) plotElement = await page.QuerySelectorAsync("[data-testid='plot']");
            
            if (plotElement != null)
            {
                description = await plotElement.InnerTextAsync();
            }

            // норм качество картинки, если она уже была найдена
            info.ImageUrl = GetFullQualityImageUrl(info.PreviewImageUrl);

            return new MovieDetailsParseResult
            {
                Id = info.Id,
                ImageUrl = info.ImageUrl,
                PreviewImageUrl = info.PreviewImageUrl,
                Description = description,
                Genres = genres,
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при парсинге деталей фильма: {ex.Message}");
            return null;
        }
    }
    
    public async Task<IEnumerable<MovieDetailsParseResult>> ParseMoviesDetailsAsync(List<MovieRepo> movieRepos)
    {
        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = false });
        var context = await browser.NewContextAsync();
        var parseResult = new List<MovieDetailsParseResult>();

        // для каждого фильма получаем детали
        foreach (var movie in movieRepos)
        {
            if (string.IsNullOrEmpty(movie.MovieLink) || !movie.MovieLink.StartsWith("http")) continue;
            
            var moviePage = await context.NewPageAsync();
            try 
            {
                await moviePage.GotoAsync(movie.MovieLink, new PageGotoOptions
                {
                    WaitUntil = WaitUntilState.DOMContentLoaded
                });
                
                var detailsData = await GetMovieDetailsAsync(moviePage, movie);
                if (detailsData == null) continue;
                
                parseResult.Add(detailsData);
            }
            finally 
            {
                await moviePage.CloseAsync();
            }
            
        }

        return parseResult;
    }
}