using Microsoft.Playwright;

namespace Filmograf.ParsingService.Services;

public class PlaywrightService
{
    public static async Task<IPage?> ParsePageAsync(string url)
    {
        using var playwright = await Playwright.CreateAsync();
        
        // запуск браузера в headless режиме
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = true, // Режим без графического интерфейса
            Args = new[] { "--no-sandbox", "--disable-dev-shm-usage" }
        });
        
        // создание контекста с настройками
        var context = await browser.NewContextAsync(new BrowserNewContextOptions
        {
            ViewportSize = new ViewportSize { Width = 1920, Height = 1080 },
            UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        });
        
        // создание новой страницы
        var page = await context.NewPageAsync();
        
        try
        {
            // переход на сайт с ожиданием загрузки сети
            await page.GotoAsync(url, new PageGotoOptions
            {
                WaitUntil = WaitUntilState.NetworkIdle,
                Timeout = 30000
            });

            // ожидание загрузки контента
            await page.WaitForSelectorAsync(".ipc-metadata-list", new PageWaitForSelectorOptions
            {
                Timeout = 10000
            });

            // получение заголовка страницы
            var title = await page.TitleAsync();
            Console.WriteLine($"Заголовок страницы: {title}");
            
            // получение HTML содержимого всей страницы
            var htmlContent = await page.ContentAsync();
            Console.WriteLine($"Длина HTML: {htmlContent.Length} символов");
            
            // сохранение HTML в файл для отладки
            await File.WriteAllTextAsync("imdb_page.html", htmlContent);
            Console.WriteLine("HTML сохранен в файл: imdb_page.html");
            
            // получение HTML конкретного элемента (например, таблицы с фильмами)
            var chartElement = await page.QuerySelectorAsync(".ipc-metadata-list");
            if (chartElement != null)
            {
                var chartHtml = await chartElement.InnerHTMLAsync();
                Console.WriteLine($"Длина HTML таблицы: {chartHtml.Length} символов");
                
                // await File.WriteAllTextAsync("imdb_chart.html", chartHtml);
                // Console.WriteLine("HTML таблицы сохранен в файл: imdb_chart.html");
            }

            return page;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка: {ex.Message}");
            return null;
        }
        finally
        {
            await context.CloseAsync();
        }
    }
    
    public static async Task<IPage?> ParsePageAsync(IBrowser browser, IBrowserContext context, string url)
    {
        // создание новой страницы
        var page = await context.NewPageAsync();
        
        try
        {
            // переход на сайт с ожиданием загрузки сети
            await page.GotoAsync(url, new PageGotoOptions
            {
                WaitUntil = WaitUntilState.NetworkIdle,
                Timeout = 30000
            });

            // ожидание загрузки контента
            await page.WaitForSelectorAsync(".ipc-metadata-list", new PageWaitForSelectorOptions
            {
                Timeout = 10000
            });

            // получение заголовка страницы
            var title = await page.TitleAsync();
            Console.WriteLine($"Заголовок страницы: {title}");
            
            // получение HTML содержимого всей страницы
            var htmlContent = await page.ContentAsync();
            Console.WriteLine($"Длина HTML: {htmlContent.Length} символов");
            
            // сохранение HTML в файл для отладки
            await File.WriteAllTextAsync("imdb_page.html", htmlContent);
            Console.WriteLine("HTML сохранен в файл: imdb_page.html");
            
            // получение HTML конкретного элемента (например, таблицы с фильмами)
            var chartElement = await page.QuerySelectorAsync(".ipc-metadata-list");
            if (chartElement != null)
            {
                var chartHtml = await chartElement.InnerHTMLAsync();
                Console.WriteLine($"Длина HTML таблицы: {chartHtml.Length} символов");
                
                // await File.WriteAllTextAsync("imdb_chart.html", chartHtml);
                // Console.WriteLine("HTML таблицы сохранен в файл: imdb_chart.html");
            }

            return page;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка: {ex.Message}");
            await page.CloseAsync();
            return null;
        }
        // Не закрываем контекст здесь, так как он управляется вызывающим кодом
    }
    
    public static async Task InstallPlaywright()
    {
        try
        {
            // Установка браузеров Playwright
            var exitCode = Microsoft.Playwright.Program.Main(new[] { "install" });
            if (exitCode != 0)
            {
                throw new Exception($"Playwright install failed with exit code {exitCode}");
            }
            Console.WriteLine("Playwright браузеры успешно установлены");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при установке Playwright: {ex.Message}");
        }
    }
}