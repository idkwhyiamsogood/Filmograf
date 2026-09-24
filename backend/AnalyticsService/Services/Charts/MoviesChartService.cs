using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Repo;

namespace Filmograf.AnalyticsService.Services.Charts;

// p.s. возможно тут не оч оптимизировано, но это background,event-bound нагрузка - так что пох)
public class MoviesChartService
{
    private readonly static int ChartSize = 100; // todo: to app settings
    
    private readonly MoviesClicksAnalyticRepository _clickAnalyticRepository;
    private readonly MovieRepository _movieRepository;
    private readonly TopPicksRepository _topPicksRepository;
    
    public MoviesChartService(TopPicksRepository topPicksRepository, MoviesClicksAnalyticRepository clickAnalyticRepository,
        MovieRepository movieRepository)
    {
        _topPicksRepository = topPicksRepository;
        _clickAnalyticRepository = clickAnalyticRepository;
        _movieRepository = movieRepository;
    }

    private readonly int[] Intervals = new[] { 7, 14, 21, 30, 60 };
    private async Task<IEnumerable<MoviesClicksAnalyticRepo>> GetRecentDataAsync()
    {
        var now = DateOnly.FromDateTime(DateTime.Now.Date);

        foreach (var interval in Intervals)
        {
            var fromDate = now.AddDays(-interval);
            var data = await _clickAnalyticRepository.GetByPeriodAsync(fromDate, now);

            // считаем кол-во фильмов
            var moviesCount = data
                .Select(i => i.MovieId)
                .Distinct()
                .Count();
            
            // p.s. 0.9, т.к. 10% будет приходиться на рандомные фильмы
            if (moviesCount >= (int)(ChartSize * 0.9f)) return data;
        }

        return await _clickAnalyticRepository.GetAllAsync();
    }

    public async Task<IEnumerable<string>> HandleCompileTopChartAsync()
    {
        var now = DateOnly.FromDateTime(DateTime.Now.Date);
        var periodData = await GetRecentDataAsync();

        // Считаем веса и получаем отсортированный список ID
        var sortedRealIds = periodData
            .GroupBy(x => x.MovieId)
            .Select(group => new
            {
                MovieId = group.Key,
                RankScore = group.Sum(item => 
                    item.Count * Math.Max(0.1, 1.0 - (Math.Max(0, now.DayNumber - item.TargetDate.DayNumber) * 0.015)))
            })
            .OrderByDescending(x => x.RankScore)
            .Select(i => i.MovieId)
            .ToList();

        // Определяем пропорции
        int realLimit = (int)(ChartSize * 0.9); // Цель: 90 реальных
        var finalRealList = sortedRealIds.Take(realLimit).ToList();
        
        int randomNeeded = ChartSize - finalRealList.Count;
        
        // Достаем случайные фильмы (из основного репозитория фильмов)
        // p.s. Передай сюда ID уже выбранных фильмов, чтобы не было дублей, 
        // но для простоты примера просто вызовем:
        var randomMovies = await _movieRepository.GetRandomManyAsync(randomNeeded);
        var randomIds = randomMovies.Select(m => m.Id).ToList();

        // 4. Логика перемешивания
        return MixMovies(finalRealList, randomIds, ChartSize);
    }

    private List<string> MixMovies(List<string> realIds, List<string> randomIds, int targetSize)
    {
        // Если реальных фильмов критически мало (меньше 20% от чарта), 
        // не мешаем их, а просто ставим в начало (Cold Start Protection)
        if (realIds.Count < targetSize * 0.2)
        {
            return realIds.Concat(randomIds).Take(targetSize).ToList();
        }

        var result = new List<string>();
        var realQueue = new Queue<string>(realIds);
        var randomQueue = new Queue<string>(randomIds);

        // Алгоритм "Угасающего шага":
        // Начинаем вставлять 1 рандомный фильм после каждых N реальных.
        // N будет уменьшаться, чтобы внизу списка рандома было больше.
        int currentStep = 12; // Сначала идет пачка из 12 реальных

        while (result.Count < targetSize)
        {
            // Добавляем пачку реальных
            for (int i = 0; i < currentStep && realQueue.Count > 0 && result.Count < targetSize; i++)
            {
                result.Add(realQueue.Dequeue());
            }

            // Добавляем один случайный для "разбавления"
            if (randomQueue.Count > 0 && result.Count < targetSize)
            {
                result.Add(randomQueue.Dequeue());
            }

            // Уменьшаем шаг, чтобы рандом встречался чаще к концу списка
            // (но не меньше чем 2, чтобы не превратить конец в чистый рандом)
            if (currentStep > 2) currentStep--;
        }

        return result;
    }
}