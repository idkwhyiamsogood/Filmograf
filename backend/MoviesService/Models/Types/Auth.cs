using System.ComponentModel;

namespace Filmograf.MoviesService.Models.Types;

public class Auth
{
    public string Token { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    [DefaultValue(true)]
    public bool IsActive { get; set; } = true;
}