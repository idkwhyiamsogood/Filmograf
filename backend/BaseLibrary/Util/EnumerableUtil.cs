namespace Filmograf.BaseLibrary.Util;

public static class EnumerableUtil
{
    public static IEnumerable<T> DeleteItem<T>(this IEnumerable<T> source, T destination)
    {
        return source.Where(item => !EqualityComparer<T>.Default.Equals(item, destination)).ToList();
    }

    public static IEnumerable<string> GuidArrToStrArr(this IEnumerable<Guid> source)
    {
        return source.Select(item => item.ToString());
    }

    public static IEnumerable<Guid> StrArrToGuidArr(this IEnumerable<string> source)
    {
        return source.Select(item => Guid.Parse(item));
    }

    public static bool AnyIsNull(this IEnumerable<object?> items)
    {
        return items.Any(item => item == null);
    }
}