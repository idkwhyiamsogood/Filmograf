using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.CommentsService.Services;

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