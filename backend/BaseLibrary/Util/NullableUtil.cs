namespace Filmograf.BaseLibrary.Util;

public class NullableUtil
{
    public static bool AnyIsNull(params object?[] items) => 
        items.Any(i => i is null);
}