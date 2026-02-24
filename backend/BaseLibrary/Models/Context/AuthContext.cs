using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.Models.Context;

public class AuthContext
{
    public Auth? CurrentAuth { get; set; }
    public User? CurrentUser { get; set; }
}