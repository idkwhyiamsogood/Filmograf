using Filmograf.BaseLibrary.Models.Entities;

namespace Filmograf.BaseLibrary.Models.Context;

public class AuthContext
{
    public Auth? CurrentAuth { get; set; }
    public User? CurrentUser { get; set; }
}