using MongoDB.Bson;

namespace Filmograf.BaseLibrary.Util;

public class MongoDbUtil
{
    public static string GenerateNewId()
    {
        return ObjectId.GenerateNewId().ToString();
    }
}