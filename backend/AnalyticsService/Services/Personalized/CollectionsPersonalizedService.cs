using Filmograf.AnalyticsService.DataAccess.Repositories;
using Filmograf.AnalyticsService.Util;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Services;

namespace Filmograf.AnalyticsService.Services.Personalized;

public class CollectionsPersonalizedService
{
    private readonly TopPicksService _topPicksService;
    private readonly UserCollectionsActivityDailyRepository _activityRepository;
    private readonly CollectionRepository _collectionRepository;
    
    private const int HistoryDays = 30; // Берем историю за 30 дней
    private const int TargetRecommendationSize = 100; // Размер выдачи
    private const float TimeDecayAlpha = 0.02f; // Коэффициент затухания интереса
    
    public CollectionsPersonalizedService(TopPicksService topPicksService, UserCollectionsActivityDailyRepository activityRepository,
        CollectionRepository collectionRepository)
    {
        _topPicksService = topPicksService;
        _activityRepository = activityRepository;
        _collectionRepository = collectionRepository;
    }
    
    public async Task<IEnumerable<string>> GenerateForUserAsync(Guid userId, CancellationToken ct = default)
    {
        var pagination = new PaginationQueryDto 
        { Page = 0, Count = 100 };

        var globalTopChartIds = await _topPicksService
            .GetFromChartAsync(pagination, "FilmTopCollections");

        return await GenerateForUserAsync(userId, globalTopChartIds.Ids ?? [], ct);
    }
    
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
        var watchedCollectionIds = allClicks.Select(c => c.CollectionId).ToHashSet();

        // 3. Формируем профиль жанров (Time Decay)
        var genreWeights = new Dictionary<Guid, float>();

        foreach (var click in allClicks)
        {
            if (click.CollectionCache?.Tags == null) continue;

            // Считаем вес клика в зависимости от давности
            int daysAgo = (now - click.Timestamp).Days;
            float weight = Math.Max(0.1f, 1.0f - (daysAgo * TimeDecayAlpha));

            foreach (var genreId in click.CollectionCache.Tags)
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

        var topTagIds = topGenres.Select(g => g.Key).ToList();

        // 4. Candidate Generation (Отбор кандидатов)
        var candidateMovies = await _collectionRepository.GetByAnyTagsAsync(
            tagIds: topTagIds.ToArray(), 
            skip:0, 
            limit: 300, 
            showDeleted: true, 
            ct: ct
        );

        // 5. Ранжирование (Scoring)
        var scoredCandidates = candidateMovies
            .Where(m => !watchedCollectionIds.Contains(m.Id)) // Исключаем просмотренное
            .Select(m => 
            {
                // Считаем совпадение по жанрам (Genre Match Score)
                float genreScore = 0;
                if (m.GenreIds != null)
                {
                    foreach (var gId in m.GenreIds)
                    {
                        if (!genreWeights.TryGetValue(gId, out float weight)) continue;
                        genreScore += weight;
                    }
                }

                // Бонус за качество (от 0 до 1)
                // float qualityBonus = m.RateIMDb / 10.0f;
                
                // Легкий бонус за популярность (нормализуем логарифмом, чтобы хиты не перевешивали жанр)
                float popularityBonus = m.ViewsCount > 0 ? (float)Math.Log10(m.ViewsCount) * 0.1f : 0;

                // Итоговый скор (жанр - самое важное)
                float finalScore = (genreScore * 2.0f) + /*qualityBonus +*/ popularityBonus;

                return new { MovieId = m.Id, Score = finalScore };
            })
            .OrderByDescending(x => x.Score)
            .Select(x => x.MovieId)
            .ToList();

        // 6. Микс с глобальным топом (Разбавление / Serendipity)
        var finalRecommendations = CollectionsPersonalizedUtils.MixWithGlobalChart(scoredCandidates, globalTopChartIds, watchedCollectionIds, TargetRecommendationSize);

        // 7. Сохраняем в БД
        return finalRecommendations;
    }
}