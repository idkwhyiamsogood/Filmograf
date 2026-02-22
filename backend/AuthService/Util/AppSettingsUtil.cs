using Newtonsoft.Json;

namespace Filmograf.MoviesService.Util;

public class AppSettingsUtil
{
    public static AppSettings AppSettings = null!;
    private static readonly string AppSettingsFileName = "env.json";
    private static readonly string AppSettingsFilePath = Path.Combine(Directory.GetCurrentDirectory() + "/" + AppSettingsFileName);

    public static void LoadAppSettingsData()
    {
        AppSettings = LoadAppSettings();
    }

    private static AppSettings LoadAppSettings()
    {
        string json = File.ReadAllText(AppSettingsFilePath);
        var appSettings = JsonConvert.DeserializeObject<AppSettings>(json);

        if (appSettings == null)
        {
            Console.WriteLine("Не удалось загрузить \'env.json\'");
            throw new Exception();
        }

        return appSettings;
    }
}

public class AppSettings
{
    public DbConnectionSettings DbConnectionSettings { get; set; }
    public SecretsSettings SecretsSettings { get; set; } = null!;
    public RedisSettings RedisSettings { get; set; } = null!;
    public RabbitConnectionSettings RabbitConnectionSettings  { get; set; } = null!;
}

public class SecretsSettings
{
    public string BCryptSecret { get; set; }
}

public class RedisSettings
{
    public string Host { get; set; }
}

public class RabbitConnectionSettings
{
    public string Host { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
}

public class DbConnectionSettings
{
    public string Host { get; set; }
    public int Port { get; set; }
    public string Database { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
}