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
    
    private readonly PaginationQueryDto _pagination100 = new PaginationQueryDto { Page = 0, Count = 100 };
    public async Task<IEnumerable<string>> GenerateForUserAsync(Guid userId, CancellationToken ct = default)
    {
        var globalTopChartIds = await _topPicksService
            .GetFromChartAsync(_pagination100, "FilmTopCollections");

        return await GenerateForUserAsync(userId, globalTopChartIds.Ids ?? [], ct);
    }

    public async Task<IEnumerable<string>> GenerateForUserAsync(Guid userId, IEnumerable<string> globalTopChartIds, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var today = DateOnly.FromDateTime(now);
        var fromDate = today.AddDays(-HistoryDays);

        // достаем историю пользователя
        var history = await _activityRepository.GetUserHistoryAsync(userId, fromDate, today, ct);
        
        // извлекаем все клики плоским списком
        var allClicks = history.SelectMany(h => h.Clicks).ToList();

        // Cold Start: если истории нет или она слишком мала, просто отдаем глобальный топ
        if (allClicks.Count < 3)
        {
            return globalTopChartIds
                .Take(TargetRecommendationSize)
                .ToList();
        }

        // собираем ID просмотренных фильмов, чтобы не рекомендовать их снова
        var watchedCollectionIds = allClicks.Select(c => c.CollectionId).ToHashSet();

        // формируем профиль жанров (Time Decay)
        var genreWeights = new Dictionary<Guid, float>();

        foreach (var click in allClicks)
        {
            if (click.CollectionCache?.Tags == null) continue;

            // считаем вес клика в зависимости от давности
            int daysAgo = (now - click.Timestamp).Days;
            float weight = Math.Max(0.1f, 1.0f - (daysAgo * TimeDecayAlpha));

            foreach (var genreId in click.CollectionCache.Tags)
            {
                if (!genreWeights.ContainsKey(genreId))
                    genreWeights[genreId] = 0;
                
                genreWeights[genreId] += weight;
            }
        }

        // берем Топ-5 любимых жанров юзера
        var topGenres = genreWeights
            .OrderByDescending(kvp => kvp.Value)
            .Take(5)
            .ToList();

        var topTagIds = topGenres.Select(g => g.Key).ToList();

        // Candidate Generation (отбор кандидатов)
        var candidateMovies = await _collectionRepository.GetByAnyTagsAsync(
            tagIds: topTagIds.ToArray(), 
            skip:0, 
            limit: 300, 
            showDeleted: true, 
            ct: ct
        );

        // ранжирование (Scoring)
        var scoredCandidates = candidateMovies
            .Where(c => !watchedCollectionIds.Contains(c.Id)) // исключаем просмотренное
            .Select(c => 
            {
                // считаем совпадение по жанрам (Genre Match Score)
                float genreScore = 0;
                if (c.GenreIds != null)
                {
                    foreach (var gId in c.GenreIds)
                    {
                        if (!genreWeights.TryGetValue(gId, out float weight)) continue;
                        genreScore += weight;
                    }
                }

                // легкий бонус за популярность (нормализуем логарифмом, чтобы хиты не перевешивали жанр)
                float popularityBonus = c.ViewsCount > 0 ? (float) Math.Log10(c.ViewsCount) * 0.1f : 0;

                // итоговый скор (жанр - самое важное)
                float finalScore = (genreScore * 2.0f) + /*qualityBonus +*/ popularityBonus;

                return new { CollectionId = c.Id, Score = finalScore };
            })
            .OrderByDescending(x => x.Score)
            .Select(x => x.CollectionId)
            .ToList();

        // микс с глобальным топом
        var finalRecommendations = CollectionsPersonalizedUtils
            .MixWithGlobalChart(scoredCandidates, globalTopChartIds, watchedCollectionIds, TargetRecommendationSize);

        // возвращаем результат
        return finalRecommendations;
    }
}