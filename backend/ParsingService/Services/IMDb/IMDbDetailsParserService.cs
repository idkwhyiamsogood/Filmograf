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
            var genres = new List<string>();
            
            // жанры (по чипам/тегам)
            var genreElements = await page.QuerySelectorAllAsync("[data-testid='genres'] .ipc-chip__text");
            foreach (var el in genreElements)
            {
                genres.Add(await el.InnerTextAsync());
            }

            // описание 
            var plotElement = await page.QuerySelectorAsync("[data-testid='plot-xl']"); 
            if (plotElement == null) plotElement = await page.QuerySelectorAsync("[data-testid='plot-l']");
            if (plotElement != null) info.Description = await plotElement.InnerTextAsync();

            // норм качество картинки, если она уже была найдена
            info.ImageUrl = GetFullQualityImageUrl(info.PreviewImageUrl);

            return new MovieDetailsParseResult
            {
                Id = info.Id,
                ImageUrl = info.ImageUrl,
                PreviewImageUrl = info.PreviewImageUrl,
                Description = info.Id,
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
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = true });
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