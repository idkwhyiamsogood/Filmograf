using System.ComponentModel.DataAnnotations;

namespace Filmograf.MoviesService.Models.Dto;

public class VerifyIdempotenceRequestDto
{
    [MaxLength(512)]
    public string Code { get; set; }
}

public class VerifyIdempotenceResponseDto
{
    public string Jwt { get; set; }
}