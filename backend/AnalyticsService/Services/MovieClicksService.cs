using AutoMapper;
using Filmograf.AnalyticsService.DataAccess.Repositories;
using Filmograf.AnalyticsService.Models.Repo;
using Filmograf.AnalyticsService.Util;

namespace Filmograf.AnalyticsService.Services;

public class MovieClicksService
{
    private readonly UserMoviesActivityDailyRepository _userMoviesActivityRepository;
    private readonly MoviesClicksAnalyticRepository _moviesClicksRepository;
    
    public MovieClicksService(UserMoviesActivityDailyRepository userMoviesActivityRepository, 
        MoviesClicksAnalyticRepository moviesClicksRepository)
    {
        _userMoviesActivityRepository = userMoviesActivityRepository;
        _moviesClicksRepository = moviesClicksRepository;
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

    public async Task HandleClickMovieAsync(Guid userId, string movieId)
    {
        var now = DateTime.UtcNow;
        var todayDate = DateOnly.FromDateTime(now);
        
        // сперва учет кликов по отдельному фильму
        await _moviesClicksRepository.IncrementClickAsync(movieId, todayDate);
        
        // учет кликов для отдельного пользователя
        var todayActivityDaily = await _userMoviesActivityRepository.GetByUserAndDateAsync(userId, todayDate);
        if (!CheckNewClickAvailable(todayActivityDaily, movieId, now)) return;
        
        // запись персонального события
        var item = new UserClickEvent 
        { MovieId = movieId, Timestamp = now };
    
        await _userMoviesActivityRepository.AddClickAsync(userId, item);
    }
}