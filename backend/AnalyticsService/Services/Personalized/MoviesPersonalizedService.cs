using Filmograf.AnalyticsService.DataAccess.Repositories;
using Filmograf.AnalyticsService.Util;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Services;

namespace Filmograf.AnalyticsService.Services.Personalized;

public class MoviesPersonalizedService
{
    private readonly TopPicksService _topPicksService;
    private readonly UserMoviesActivityDailyRepository _activityRepository;
    private readonly MovieRepository _movieRepository;
    
    private const int HistoryDays = 30; // Берем историю за 30 дней
    private const int TargetRecommendationSize = 100; // Размер выдачи
    private const float TimeDecayAlpha = 0.02f; // Коэффициент затухания интереса

    public MoviesPersonalizedService(UserMoviesActivityDailyRepository activityRepository, MovieRepository movieRepository,
        TopPicksService topPicksService)
    {
        _activityRepository = activityRepository;
        _movieRepository = movieRepository;
        _topPicksService = topPicksService;
    }

    public async Task<IEnumerable<string>> GenerateForUserAsync(Guid userId, CancellationToken ct = default)
    {
        var pagination = new PaginationQueryDto 
        { Page = 0, Count = 100 };

        var globalTopChartIds = await _topPicksService
            .GetFromChartAsync(pagination, "FilmTopMovies");

        return await GenerateForUserAsync(userId, globalTopChartIds.Ids, ct);
    }

    // globalTopChartIds передаем извне, чтобы не пересчитывать глобальный топ для каждого юзера
    public async Task<IEnumerable<string>> GenerateForUserAsync(Guid userId, IEnumerable<string> globalTopChartIds, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var today = DateOnly.FromDateTime(now);
        var fromDate = today.AddDays(-HistoryDays);

        // 1. Достаем историю пользователя
        var history = await _activityRepository.GetUserHistoryAsync(userId, fromDate, today, ct);
        
        // Извлекаем все клики плоским списком
        var allClicks = history.SelectMany(h => h.Clicks).ToList();

        // 2. Cold Start: Если истории нет или она слишком мала, просто отдаем глобальный топ
        if (allClicks.Count < 3)
        {
            return globalTopChartIds
                .Take(TargetRecommendationSize)
                .ToList();
        }

        // Собираем ID просмотренных фильмов, чтобы не рекомендовать их снова
        var watchedMovieIds = allClicks.Select(c => c.MovieId).ToHashSet();

        // 3. Формируем профиль жанров (Time Decay)
        var genreWeights = new Dictionary<Guid, float>();

        foreach (var click in allClicks)
        {
            if (click.MovieCache?.Genres == null) continue;

            // Считаем вес клика в зависимости от давности
            int daysAgo = (now - click.Timestamp).Days;
            float weight = Math.Max(0.1f, 1.0f - (daysAgo * TimeDecayAlpha));

            foreach (var genreId in click.MovieCache.Genres)
            {
                if (!genreWeights.ContainsKey(genreId))
                    genreWeights[genreId] = 0;
                
                genreWeights[genreId] += weight;
            }
        }

        // Берем Топ-5 любимых жанров юзера
        var topGenres = genreWeights
            .OrderByDescending(kvp => kvp.Value)
            .Take(5)
            .ToList();

        var topGenreIds = topGenres.Select(g => g.Key).ToList();

        // 4. Candidate Generation (Отбор кандидатов)
        // Ищем фильмы, у которых есть хотя бы один из топовых жанров
        var candidateMovies = await _movieRepository.GetByGenresAsync(topGenreIds, limit: 300, ct);

        // 5. Ранжирование (Scoring)
        var scoredCandidates = candidateMovies
            .Where(m => !watchedMovieIds.Contains(m.Id)) // Исключаем просмотренное
            .Select(m => 
            {
                // Считаем совпадение по жанрам (Genre Match Score)
                float genreScore = 0;
                if (m.GenreIds != null)
                {
                    foreach (var gId in m.GenreIds)
                    {
                        if (genreWeights.TryGetValue(gId, out float weight))
                        {
                            genreScore += weight;
                        }
                    }
                }

                // Бонус за качество (от 0 до 1)
                float qualityBonus = m.RateIMDb / 10.0f;
                
                // Легкий бонус за популярность (нормализуем логарифмом, чтобы хиты не перевешивали жанр)
                float popularityBonus = m.ViewsCount > 0 ? (float)Math.Log10(m.ViewsCount) * 0.1f : 0;

                // Итоговый скор (жанр - самое важное)
                float finalScore = (genreScore * 2.0f) + qualityBonus + popularityBonus;

                return new { MovieId = m.Id, Score = finalScore };
            })
            .OrderByDescending(x => x.Score)
            .Select(x => x.MovieId)
            .ToList();

        // 6. Микс с глобальным топом (Разбавление / Serendipity)
        var finalRecommendations = CollectionsPersonalizedUtils.MixWithGlobalChart(scoredCandidates, globalTopChartIds, watchedMovieIds, TargetRecommendationSize);

        // 7. Сохраняем в БД
        return finalRecommendations;
    }
}