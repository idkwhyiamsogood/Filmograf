using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;

namespace Filmograf.BaseLibrary.DataAccess.Serializers;

public class DateOnlySerializer : SerializerBase<DateOnly>
{
    public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, DateOnly value)
    {
        var dateTime = value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        BsonSerializer.Serialize(context.Writer, typeof(DateTime), dateTime);
    }

    public override DateOnly Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        var dateTime = BsonSerializer.Deserialize<DateTime>(context.Reader);
        return DateOnly.FromDateTime(dateTime);
    }
}