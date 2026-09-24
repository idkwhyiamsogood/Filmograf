namespace Filmograf.BaseLibrary.Util;

public static class NumberUtils
{
    public static int ParseIntOrDefault(this string source, int defaultValue = 0)
    {
        try
        {
            if (!int.TryParse(source, out int value)) return defaultValue;
            return value;
        }
        catch (Exception)
        {
            return defaultValue;
        }
    }
}