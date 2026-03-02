using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.MoviesService.Services;

public class MongoIndexService : IHostedService
{
    private readonly IMongoCollection<MovieRepo> _buildings;

    public MongoIndexService(IMongoDatabase database)
    {
        _buildings = database.GetCollection<MovieRepo>(MovieRepository.CollectionName);
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            // todo
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при создании индексов: {ex.Message}");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}