using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Filmograf.BaseLibrary.Models.Repo;

public abstract class RepoBase
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public DateTime CreateDate { get; set; } = DateTime.UtcNow;

    public DateTime UpdateDate { get; set; } = DateTime.UtcNow;
    
    public DateTime LastUsedAt { get; set; } = DateTime.UtcNow;
}