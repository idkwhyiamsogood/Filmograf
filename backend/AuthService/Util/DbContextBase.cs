using Filmograf.BaseLibrary.Models.Types;
using Microsoft.EntityFrameworkCore;

namespace Filmograf.MoviesService.Util;

public class DbContextBase : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        DbConnectionSettings dbConnection = AppSettingsUtil.AppSettings.DbConnectionSettings;
        optionsBuilder.UseNpgsql($"Host={dbConnection.Host};" +
                                 $"Port={dbConnection.Port};" +
                                 $"Database={dbConnection.Database};" +
                                 $"Username={dbConnection.Username};" +
                                 $"Password={dbConnection.Password}");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    }
}