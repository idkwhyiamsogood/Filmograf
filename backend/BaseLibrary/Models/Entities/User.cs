using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Entities;

public class User : DeletableTypeBase
{
    [RegularExpression("^(Guest|Member)$")]
    public string UserType { get; set; }
    
    [MaxLength(256)]
    [EmailAddress]
    public string? Email { get; set; }
    
    [MaxLength(256)]
    public string? Name { get; set; }
    
    [MaxLength(256)]
    public string? GoogleId { get; set; }
    
    public string? AvatarUrl { get; set; }
    
    public DateTime VerifyDate { get; set; } = DateTime.UtcNow;
    
    [DefaultValue(false)]
    public bool IsBanned { get; set; } = false;
    
    [DefaultValue(false)]
    public bool IsAdmin { get; set; } = false;
    
    public DateTime LastFetchDate { get; set; } = DateTime.UtcNow;
}