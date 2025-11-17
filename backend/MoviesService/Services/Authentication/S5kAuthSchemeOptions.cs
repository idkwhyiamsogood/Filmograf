using Microsoft.AspNetCore.Authentication;

namespace Filmograf.MoviesService.Services.Authentication;

public class S5kAuthSchemeOptions : AuthenticationSchemeOptions
{
    public const string SchemeName = "S5kAuth";
}