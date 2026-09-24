using Filmograf.BaseLibrary.Util;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Filmograf.SearchService.Extensions;

internal static class MongoExtension
{
    public static IServiceCollection AddMongoDB(this IServiceCollection services)
    {
        var mongoDbSettings = AppSettingsUtil.AppSettings.MongoDbSettings;
        
        // mongoDB из коробки не понимает что надо хранить Guid в стандартном формате (Standard UUID)
        var serializer = new MongoDB.Bson.Serialization.Serializers.GuidSerializer(GuidRepresentation.Standard);
        MongoDB.Bson.Serialization.BsonSerializer.RegisterSerializer(serializer);
        
        services.AddSingleton<IMongoDatabase>(serviceProvider =>
        {
            var client = new MongoClient(mongoDbSettings.ConnectionString);
            return client.GetDatabase(mongoDbSettings.DatabaseName);
        });

        return services;
    }
}