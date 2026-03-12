using Newtonsoft.Json;

namespace Filmograf.MoviesService.Util;

public class LocalAppSettingsUtil
{
    public static LocalAppSettings AppSettings = null!;
    private static readonly string AppSettingsFileName = "env.json";
    private static readonly string AppSettingsFilePath = Path.Combine(Directory.GetCurrentDirectory(), AppSettingsFileName);

    public static void LoadAppSettingsData()
    {
        AppSettings = LoadAppSettings();
    }

    private static LocalAppSettings LoadAppSettings()
    {
        string json = File.ReadAllText(AppSettingsFilePath);
        var appSettings = JsonConvert.DeserializeObject<LocalAppSettings>(json);

        if (appSettings == null)
        {
            Console.WriteLine("Не удалось загрузить \'env.json\'");
            throw new Exception();
        }

        return appSettings;
    }
}

public class LocalAppSettings
{
    public IMDbSettings IMDbSettings { get; set; }
}

public class IMDbSettings
{
    public string TopChartLink { get; set; }
}