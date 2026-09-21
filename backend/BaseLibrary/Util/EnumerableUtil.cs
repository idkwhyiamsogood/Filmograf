namespace Filmograf.BaseLibrary.Util;

public static class EnumerableUtil
{
    public static IEnumerable<T> DeleteItem<T>(this IEnumerable<T> source, T destination)
    {
        return source.Where(item => !EqualityComparer<T>.Default.Equals(item, destination)).ToList();
    }
}