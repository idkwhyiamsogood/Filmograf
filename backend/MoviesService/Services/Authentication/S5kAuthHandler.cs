using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace Filmograf.MoviesService.Services.Authentication;

public class S5kAuthHandler : AuthenticationHandler<S5kAuthSchemeOptions>
{
    private readonly TokenService _tokenService;
    
    public S5kAuthHandler(IOptionsMonitor<S5kAuthSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder, 
        ISystemClock clock, TokenService tokenService) : base(options, logger, encoder, clock)
    {
        _tokenService = tokenService;
    }

    public S5kAuthHandler(IOptionsMonitor<S5kAuthSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder, 
        TokenService tokenService) : base(options, logger, encoder)
    {
        _tokenService = tokenService;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        try
        {
            // получаем токен из заголовка
            if (!Request.Headers.TryGetValue("X-Auth-Token", out var tokenHeader) ||
                string.IsNullOrEmpty(tokenHeader))
            {
                return AuthenticateResult.Fail("Token missing");
            }
            
            var token = tokenHeader.ToString();
            var authToken = await _tokenService.ValidateTokenAsync(token);
            if (authToken == null) return AuthenticateResult.Fail("Invalid token");
            
            // создаем claims
            var claims = new[]
            {
                new Claim("Token", token)
            };
            
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);
            
            return AuthenticateResult.Success(ticket);
        }
        catch (Exception ex)
        {
            return AuthenticateResult.Fail($"Authentication failed: {ex.Message}");
        }
    }
}