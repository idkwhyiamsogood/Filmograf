using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.Models.Entities;

public class Auth : TypeBase
{
    [Required]
    public string Jwt { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [DefaultValue(true)]  // по умолчанию сессия активна
    public bool State { get; set; } = true;

    public string? UserAgent { get; set; }

    public string? Ip { get; set; }
}