using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.BaseLibrary.Util;
using Microsoft.IdentityModel.Tokens;

namespace Filmograf.MoviesService.Services;

public class JwtService
{
    public string GenerateToken(User user)
    {
        var secretsSettings = AppSettingsUtil.AppSettings.SecretsSettings;
        var jwtSecret = secretsSettings.JwtSecret;
        var validIssuer = secretsSettings.JwtValidIssuer;
        var validAudience = secretsSettings.JwtValidAudience;
        var key = Encoding.UTF8.GetBytes(jwtSecret);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim("user_type", user.UserType),
            new Claim(ClaimTypes.Email, user.Email ?? "guest@guest.guest"),
            new Claim("google_id", user.GoogleId ?? "guest"),
            new Claim(ClaimTypes.Name, user.Name ?? "guest")
        };

        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(15),
            SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256),
            Issuer = validIssuer,
            Audience = validAudience
        };

        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(descriptor);
        return handler.WriteToken(token);
    }
}