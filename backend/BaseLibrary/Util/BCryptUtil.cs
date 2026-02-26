using BCrypt.Net;

namespace Filmograf.BaseLibrary.Util;

public class BCryptUtil
{
    public static string HashWithPepper(string value)
    {
        string pepper = AppSettingsUtil.AppSettings.SecretsSettings.BCryptSecret;
        string passwordWithPepper = value + pepper;
        return BCrypt.Net.BCrypt.EnhancedHashPassword(
            passwordWithPepper,
            hashType: HashType.SHA512
        );
    }

    public static bool Verify(string value, string hashedValue)
    {
        string pepper = AppSettingsUtil.AppSettings.SecretsSettings.BCryptSecret;
        string passwordWithPepper = value + pepper;
        return BCrypt.Net.BCrypt.EnhancedVerify(
            passwordWithPepper,
            hashedValue,
            hashType: HashType.SHA512
        );
    }
}
