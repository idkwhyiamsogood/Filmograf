using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.MoviesService.Services;

public class MongoIndexService : IHostedService
{
    private readonly IMongoCollection<MovieRepo> _movies;
    private readonly IMongoCollection<MovieRateRepo> _moviesRates;
    private readonly IMongoCollection<TopPicksRepo> _topPicks;
    private readonly IMongoCollection<CommentRepo> _comments;
    private readonly IMongoCollection<CommentLikeRepo> _commentLikes;

    public MongoIndexService(IMongoDatabase database)
    {
        _movies = database.GetCollection<MovieRepo>(MovieRepository.CollectionName);
        _moviesRates = database.GetCollection<MovieRateRepo>(MovieRateRepository.CollectionName);
        _topPicks = database.GetCollection<TopPicksRepo>(TopPicksRepository.CollectionName);
        _comments = database.GetCollection<CommentRepo>(CommentRepository.CollectionName);
        _commentLikes = database.GetCollection<CommentLikeRepo>(CommentLikeRepository.CollectionName);
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            await _movies.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<MovieRepo>(
                    Builders<MovieRepo>.IndexKeys
                        .Ascending(x => x.Name)
                        .Ascending(x => x.Year)
                ),
                new CreateIndexModel<MovieRepo>(
                    Builders<MovieRepo>.IndexKeys
                        .Ascending(x => x.GenreIds)
                )
            });
            
            await _moviesRates.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<MovieRateRepo>(
                    Builders<MovieRateRepo>.IndexKeys
                        .Ascending(x => x.UserId)
                ),
                new CreateIndexModel<MovieRateRepo>(
                    Builders<MovieRateRepo>.IndexKeys
                        .Ascending(x => x.MovieId)
                ),
                new CreateIndexModel<MovieRateRepo>(
                    Builders<MovieRateRepo>.IndexKeys
                        .Ascending(x => x.UserId)
                        .Ascending(x => x.MovieId)
                )
            });
            
            await _topPicks.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<TopPicksRepo>(
                    Builders<TopPicksRepo>.IndexKeys
                        .Ascending(x => x.ChartType)
                )
            });
            
            await _comments.Indexes.CreateManyAsync(new[]
            {
                // быстрый выбор комментариев сущности
                new CreateIndexModel<CommentRepo>(
                    Builders<CommentRepo>.IndexKeys
                        .Ascending(x => x.EntityId)
                        .Ascending(x => x.EntityType)
                        .Ascending(x => x.Path)
                ),

                // быстрый выбор root-комментов
                new CreateIndexModel<CommentRepo>(
                    Builders<CommentRepo>.IndexKeys
                        .Ascending(x => x.EntityId)
                        .Ascending(x => x.Depth)
                ),

                // быстрый поиск детей
                new CreateIndexModel<CommentRepo>(
                    Builders<CommentRepo>.IndexKeys
                        .Ascending(x => x.ParentId)
                )
            });
            
            await _commentLikes.Indexes.CreateManyAsync(new[]
            {
                // уникальность лайка
                new CreateIndexModel<CommentLikeRepo>(
                    Builders<CommentLikeRepo>.IndexKeys
                        .Ascending(x => x.CommentId)
                        .Ascending(x => x.UserId),
                    new CreateIndexOptions { Unique = true }
                ),

                // быстрый count по CommentId
                new CreateIndexModel<CommentLikeRepo>(
                    Builders<CommentLikeRepo>.IndexKeys
                        .Ascending(x => x.CommentId)
                )
            });
        }
        catch (Exception ex)
        {
            // todo логи добавь, забал
            Console.WriteLine($"Ошибка при создании индексов: {ex.Message}");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}