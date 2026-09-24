using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;

namespace Filmograf.AnalyticsService.Services.HistoryBuilding;

public class MoviesHistoryBuildingService
{
    private readonly UserMoviesActivityDailyRepository _activityRepository;

    public MoviesHistoryBuildingService(UserMoviesActivityDailyRepository activityRepository)
    {
        _activityRepository = activityRepository;
    }

    private async Task<List<UserMovieClickEvent>> ListUserClicksAsync(Guid userId, PaginationQueryDto pagination,
        CancellationToken ct = default)
    {
        // достаем историю пользователя
        var history = await _activityRepository.GetUserHistoryAsync(userId, 
            pagination.Page * pagination.Count, pagination.Count, ct);
        
        // извлекаем все клики плоским списком
        return history.SelectMany(h => h.Clicks).ToList();
    }

    private readonly PaginationQueryDto _pagination100 = new PaginationQueryDto { Page = 0, Count = 100 };
    public async Task<List<string>> HandleBuildHistoryAsync(Guid userId, CancellationToken ct = default)
    {
        var history = await ListUserClicksAsync(userId, _pagination100, ct);
        return history.Select(item => item.MovieId).ToList();
    }
}