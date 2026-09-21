using Newtonsoft.Json;

namespace Filmograf.BaseLibrary.Util;

public class AppSettingsUtil
{
    public static AppSettings AppSettings = null!;
    private static readonly string AppSettingsFileName = "env.json";
    private static readonly string AppSettingsFilePath = Path.Combine(Directory.GetCurrentDirectory() + "/../shared/" + AppSettingsFileName);

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
    public bool DevMode { get; set; }
    public bool HttpsForwardedHeaders { get; set; }
    
    public SecretsSettings SecretsSettings { get; set; } = null!;
    public RedisSettings RedisSettings { get; set; } = null!;
    public RabbitConnectionSettings RabbitConnectionSettings  { get; set; } = null!;
    public DbConnectionSettings DbConnectionSettings { get; set; }
    public GoogleO2AuthSettings GoogleO2AuthSettings { get; set; }
    public OriginSettings OriginSettings { get; set; }
    public MongoDbSettings MongoDbSettings { get; set; }
}

public class SecretsSettings
{
    public string BCryptSecret { get; set; }
    public string JwtSecret { get; set; }
    public string JwtValidIssuer { get; set; }
    public string JwtValidAudience { get; set; }
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

public class GoogleO2AuthSettings
{
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
    public string AndroidClientId { get; set; }
    public string LoginRedirect { get; set; }
}

public class OriginSettings
{
    public string FrontendOrigin { get; set; }
}

public class MongoDbSettings
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
}