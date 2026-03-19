using Filmograf.AnalyticsService.Caching;
using Filmograf.AnalyticsService.DataAccess.Repositories;
using Filmograf.AnalyticsService.Models.Repo;
using Filmograf.AnalyticsService.Util;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;

namespace Filmograf.AnalyticsService.Services;

public class MovieClicksService
{
    private readonly MoviesCaching _moviesCaching;
    private readonly MovieRepository _movieRepository;
    private readonly UserMoviesActivityDailyRepository _userMoviesActivityRepository;
    private readonly MoviesClicksAnalyticRepository _moviesClicksRepository;
    
    public MovieClicksService(UserMoviesActivityDailyRepository userMoviesActivityRepository, 
        MoviesClicksAnalyticRepository moviesClicksRepository, MoviesCaching moviesCaching, MovieRepository movieRepository)
    {
        _userMoviesActivityRepository = userMoviesActivityRepository;
        _moviesClicksRepository = moviesClicksRepository;
        _moviesCaching = moviesCaching;
        _movieRepository = movieRepository;
    }

    private bool CheckNewClickAvailable(UserMoviesActivityDailyRepo? todayActivityDaily, string movieId, DateTime now)
    {
        if (todayActivityDaily == null || todayActivityDaily.Clicks == null) return true;

        // Ищем последний клик по этому фильму
        var lastClick = todayActivityDaily.Clicks
            .Where(x => x.MovieId == movieId)
            .OrderByDescending(x => x.Timestamp)
            .FirstOrDefault();

        if (lastClick == null) return true;

        var minInterval = LocalAppSettingsUtil.AppSettings.UserMovieClickChickInterval;

        // Проверяем, прошло ли более X секунд
        return (now - lastClick.Timestamp).TotalSeconds >= minInterval;
    }

    private MovieCache CreateCacheForMovie(MovieRepo movieRepo)
    {
        return new MovieCache
        {
            Id = movieRepo.Id,
            Year = int.Parse(movieRepo.Year),
            Genres = movieRepo.GenreIds ?? Array.Empty<Guid>(),
            Name = movieRepo.Name
        };
    }
    
    // todo: SRP, интеграция с MoviesService
    private async Task<MovieRepo> GetMovieAsync(string movieId)
    {
        var method = async () =>
        {
            var data = await _movieRepository.GetByIdAsync(movieId);
            if (data == null) throw new NotFoundHttpException("MovieNotFound");

            return data;
        };

        return await _moviesCaching.CachingAsync(movieId, method);
    }

    public async Task HandleClickMovieAsync(string movieId, Guid userId)
    {
        var now = DateTime.UtcNow;
        var todayDate = DateOnly.FromDateTime(now);
        
        // получаем фильм
        var movie = await GetMovieAsync(movieId);
        var movieCache = CreateCacheForMovie(movie);
        
        // сперва учет кликов по отдельному фильму
        await _moviesClicksRepository.IncrementClickAsync(movieId, todayDate);
        
        // учет кликов для отдельного пользователя
        var todayActivityDaily = await _userMoviesActivityRepository.GetByUserAndDateAsync(userId, todayDate);
        if (!CheckNewClickAvailable(todayActivityDaily, movieId, now)) return;
        
        // запись персонального события
        var item = new UserMovieClickEvent 
        { MovieId = movieId, Timestamp = now, MovieCache = movieCache };
    
        await _userMoviesActivityRepository.AddClickAsync(userId, item);
    }
}