using ParsingService.Util;

namespace ParsingService;

public class Program
{
    public static async Task Main(string[] args)
    {
        AppSettingsUtil.LoadAppSettingsData();
    }
}
