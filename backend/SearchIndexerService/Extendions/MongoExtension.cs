using MongoDB.Bson;
using MongoDB.Driver;

using Filmograf.BaseLibrary.Util;
using Filmograf.SearchIndexerService.Services;
using Filmograf.BaseLibrary.DataAccess.Serializers;
using Filmograf.SearchIndexerService.Services.Hosted;

namespace Filmograf.SearchIndexerService.Extendions;

internal static class MongoExtension
{
    public static IServiceCollection AddMongoDB(this IServiceCollection services)
    {
        var mongoDbSettings = AppSettingsUtil.AppSettings.MongoDbSettings;
        
        // mongoDB из коробки не понимает что надо хранить Guid в стандартном формате (Standard UUID)
        var guidSerializer = new MongoDB.Bson.Serialization.Serializers.GuidSerializer(GuidRepresentation.Standard);
        MongoDB.Bson.Serialization.BsonSerializer.RegisterSerializer(guidSerializer);
        
        // с date only этот еблан тоже не дружит
        var dateOnlySerializer = new DateOnlySerializer();
        MongoDB.Bson.Serialization.BsonSerializer.RegisterSerializer(dateOnlySerializer);

        services.AddSingleton<IMongoDatabase>(serviceProvider =>
        {
            var client = new MongoClient(mongoDbSettings.ConnectionString);
            return client.GetDatabase(mongoDbSettings.DatabaseName);
        });

        services.AddHostedService<MongoIndexService>();

        return services;
    }
}