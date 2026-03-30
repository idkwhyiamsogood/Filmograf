namespace Filmograf.AnalyticsService.Util;

public class CollectionsPersonalizedUtils
{
    public static List<string> MixWithGlobalChart(List<string> personalIds, IEnumerable<string> globalIds, HashSet<string> watchedIds, int targetSize)
    {
        var result = new List<string>();
        
        // Очищаем глобальный топ от того, что юзер уже видел
        var cleanGlobalIds = globalIds.Where(id => !watchedIds.Contains(id)).ToList();

        var personalQueue = new Queue<string>(personalIds);
        var globalQueue = new Queue<string>(cleanGlobalIds);

        // Пропорция: 4 персональных, 1 из топа (80% / 20%)
        while (result.Count < targetSize && (personalQueue.Count > 0 || globalQueue.Count > 0))
        {
            for (int i = 0; i < 4 && personalQueue.Count > 0 && result.Count < targetSize; i++)
            {
                result.Add(personalQueue.Dequeue());
            }

            if (globalQueue.Count > 0 && result.Count < targetSize)
            {
                var globalId = globalQueue.Dequeue();
                // Защита от дублей, если фильм из топа уже попал в персональную выдачу
                if (!result.Contains(globalId)) 
                {
                    result.Add(globalId);
                }
            }
        }

        return result;
    }
}