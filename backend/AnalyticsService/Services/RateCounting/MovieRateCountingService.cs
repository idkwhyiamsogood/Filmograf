using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Services;

namespace Filmograf.AnalyticsService.Services.RateCounting;

public class MovieRateCountingService
{
    private readonly MissionPlannerService _missionPlannerService;
    private readonly MovieRateRepository _movieRateRepository;
    private readonly MovieRepository _movieRepository;

    public MovieRateCountingService(MissionPlannerService missionPlannerService, MovieRateRepository movieRateRepository,
        MovieRepository movieRepository)
    {
        _missionPlannerService = missionPlannerService;
        _movieRateRepository = movieRateRepository;
        _movieRepository = movieRepository;
    }
    
    private async Task<float> CalcRateForMovieAsync(string movieId, CancellationToken ct = default)
    {
        var movieRates = await _movieRateRepository.GetMovieRatesAsync(movieId, ct);
        if (movieRates == null || !movieRates.Any()) return -1;

        return (float) movieRates.Average(m => m.Rate);
    }

    public async Task HandleCountRateAsync(string movieId)
    {
        var missionName = $"Movie:RateCounting:{movieId}";
        var hasLastCounting = await _missionPlannerService.HasLastMissionAsync(missionName);
        if (hasLastCounting) return;

        await _movieRepository.UpdateManipulationAsync(movieId, (async (movie, ct) =>
        {
            var movieRate = await CalcRateForMovieAsync(movieId, ct);
            movie.RateFilmograf = movieRate;
        }));
    }
}