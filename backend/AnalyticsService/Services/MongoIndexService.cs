using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.AnalyticsService.Services;

public class MongoIndexService : IHostedService
{
    private readonly IMongoCollection<MovieRepo> _movies;
    private readonly IMongoCollection<TopPicksRepo> _topPicks;
    private readonly IMongoCollection<CommentRepo> _comments;
    private readonly IMongoCollection<CommentLikeRepo> _commentLikes;

    public MongoIndexService(IMongoDatabase database)
    {
        _movies = database.GetCollection<MovieRepo>(MovieRepository.CollectionName);
        _topPicks = database.GetCollection<TopPicksRepo>(TopPicksRepository.CollectionName);
        _comments = database.GetCollection<CommentRepo>(CommentRepository.CollectionName);
        _commentLikes = database.GetCollection<CommentLikeRepo>(CommentLikeRepository.CollectionName);
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            // await _movies.Indexes.CreateManyAsync(new[]
            // {
            //     new CreateIndexModel<MovieRepo>(
            //         Builders<MovieRepo>.IndexKeys
            //             .Ascending(x => x.Name)
            //             .Ascending(x => x.Year)
            //     )
            // });
        }
        catch (Exception ex)
        {
            // todo логи добавь, забал
            Console.WriteLine($"Ошибка при создании индексов: {ex.Message}");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}