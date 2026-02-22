using System.ComponentModel.DataAnnotations;

namespace Filmograf.BaseLibrary.Models.Types;

public class User : TypeBase
{
    [RegularExpression("^(Guest|Member)$")]
    public string UserType { get; set; }
    
    public DateTime LastFetchDate { get; set; } = DateTime.UtcNow;
    
    [EmailAddress]
    public string Email { get; set; }
    
    public string GoogleId { get; set; }
    
    public DateTime VerifyDate { get; set; } = DateTime.UtcNow;
}