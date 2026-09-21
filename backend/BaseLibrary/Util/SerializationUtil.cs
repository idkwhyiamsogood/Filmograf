using System.Text;
using System.Text.Json;

namespace Filmograf.BaseLibrary.Util;

public class SerializationUtil
{
    public static TResult? DeserializeFromBytes<TResult>(byte[] bytes)
    {
        var json = Encoding.UTF8.GetString(bytes);
        return Deserialize<TResult>(json);
    }

    public static TResult? Deserialize<TResult>(string json)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        return JsonSerializer.Deserialize<TResult>(json, options);
    }

    public static byte[]? SerializeToBytes<TValue>(TValue data)
    {
        var result = Serialize(data);
        return result != null ? Encoding.UTF8.GetBytes(result) : null;
    }
    
    public static string? Serialize<TValue>(TValue data)
    {
        try
        {
            return JsonSerializer.Serialize(data, new JsonSerializerOptions
            { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}