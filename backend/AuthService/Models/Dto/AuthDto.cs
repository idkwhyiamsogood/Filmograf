namespace Filmograf.MoviesService.Models.Dto;

public class AuthResponseDto
{
    public string Jwt { get; set; }
}

public class GoogleNativeTokenDto
{
    public string IdToken { get; set; } = null!;
}