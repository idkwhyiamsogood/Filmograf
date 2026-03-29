using System.Security.Cryptography;
using System.Text;

namespace Filmograf.BaseLibrary.Util;

public class HashUtil
{
    public static string HashSHA256(string source)
    {
        var bytes = Encoding.UTF8.GetBytes(source);
        var hashedBytes = SHA256.HashData(bytes);
        return Convert.ToHexString(hashedBytes);
    }

    public static string HashObjectSHA256<T>(T source)
    {
        var serializedData = SerializationUtil.Serialize(source);
        return HashSHA256(serializedData);
    }
}