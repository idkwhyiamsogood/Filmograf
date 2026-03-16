using Filmograf.AnalyticsService.DataAccess.Repositories;
using Filmograf.AnalyticsService.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.AnalyticsService.Services;

public class MongoIndexService : IHostedService
{
    private readonly IMongoCollection<MoviesClicksAnalyticRepo> _movieClicks;
    private readonly IMongoCollection<UserMoviesActivityDailyRepo> _userMovieClicks;

    public MongoIndexService(IMongoDatabase database)
    {
        _movieClicks = database.GetCollection<MoviesClicksAnalyticRepo>(MoviesClicksAnalyticRepository.CollectionName);
        _userMovieClicks = database.GetCollection<UserMoviesActivityDailyRepo>(UserMoviesActivityDailyRepository.CollectionName);
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            await _movieClicks.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<MoviesClicksAnalyticRepo>(
                    Builders<MoviesClicksAnalyticRepo>.IndexKeys
                        .Ascending(x => x.MovieId)
                ),
                new CreateIndexModel<MoviesClicksAnalyticRepo>(
                    Builders<MoviesClicksAnalyticRepo>.IndexKeys
                        .Ascending(x => x.MovieId)
                        .Ascending(x => x.TargetDate)
                )
            }, cancellationToken);
            
            await _userMovieClicks.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<UserMoviesActivityDailyRepo>(
                    Builders<UserMoviesActivityDailyRepo>.IndexKeys
                        .Ascending(x => x.UserId)
                ),
                new CreateIndexModel<UserMoviesActivityDailyRepo>(
                    Builders<UserMoviesActivityDailyRepo>.IndexKeys
                        .Ascending(x => x.UserId)
                        .Descending(x => x.Date)
                )
            }, cancellationToken);
        }
        catch (Exception ex)
        {
            // todo логи добавь, забал
            Console.WriteLine($"Ошибка при создании индексов: {ex.Message}");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}