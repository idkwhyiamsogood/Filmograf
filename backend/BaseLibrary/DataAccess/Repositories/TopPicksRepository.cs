using Filmograf.BaseLibrary.Models.Repo;
using MongoDB.Driver;

namespace Filmograf.BaseLibrary.DataAccess.Repositories;

public class TopPicksRepository : RepositoryBase<TopPicksRepo>
{
    public static readonly string CollectionName = "top_picks";
    
    public TopPicksRepository(IMongoDatabase database) : base(database, CollectionName)
    {
    }
    
    public Task<TopPicksRepo?> GetByChartTypeAsync(string chartType, CancellationToken ct = default)
    {
        return _collection.Find(x =>
                x.ChartType == chartType)
            .FirstOrDefaultAsync(ct);
    }
}