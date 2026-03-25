namespace Filmograf.BaseLibrary.Models.Dto;

public class UserResponseDto
{
    public Guid Id { get; set; }
    public bool IsDeleted { get; set; } = false;
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsAdmin { get; set; } = false;
}