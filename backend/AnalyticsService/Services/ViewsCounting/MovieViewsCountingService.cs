using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Services;

namespace Filmograf.AnalyticsService.Services.ViewsCounting;

public class MovieViewsCountingService
{
    private readonly MissionPlannerService _missionPlannerService;
    private readonly MoviesClicksAnalyticRepository _clicksAnalyticRepository;
    private readonly MovieRepository _movieRepository;

    public MovieViewsCountingService(MissionPlannerService missionPlannerService, 
        MoviesClicksAnalyticRepository clicksAnalyticRepository, MovieRepository movieRepository)
    {
        _missionPlannerService = missionPlannerService;
        _clicksAnalyticRepository = clicksAnalyticRepository;
        _movieRepository = movieRepository;
    }

    public async Task HandleCountAsync(string movieId)
    {
        var missionName = $"Movie:ViewsCounting:{movieId}";
        var hasLastCounting = await _missionPlannerService.HasLastMissionAsync(missionName);
        if (hasLastCounting) return;
        
        await _movieRepository.UpdateManipulationAsync(movieId, (async (movie, ct) =>
        {
            var clicksCount = await _clicksAnalyticRepository.CountClicksByMovieAsync(movieId, ct);
            movie.ViewsCount = clicksCount;
        }));
    }
}