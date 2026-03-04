using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.MoviesService.Models.Types;

public class GoogleO2Idempotence : TypeBase
{
    [Required]
    [MaxLength(512)]
    public string Code { get; set; }
    
    public string? UserAgent { get; set; }

    public string? Ip { get; set; }
    
    public Guid UserId { get; set; }
}