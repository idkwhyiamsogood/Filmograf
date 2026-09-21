namespace Filmograf.SearchService.Util;

public static class EnumerableUtils
{
    public static string[] SortByQuery<T>(
        this IEnumerable<T> items,
        string query,
        Func<T, string> nameSelector,
        Func<T, string> idSelector)
    {
        return items
            .Where(x => nameSelector(x).Contains(query, StringComparison.OrdinalIgnoreCase))
            .OrderBy(x => nameSelector(x).IndexOf(query, StringComparison.OrdinalIgnoreCase))
            .ThenBy(x => nameSelector(x).Length)
            .Select(x => idSelector(x))
            .ToArray();
    }
}