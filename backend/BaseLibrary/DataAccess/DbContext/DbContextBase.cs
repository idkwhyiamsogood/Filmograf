using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.BaseLibrary.Util;
using Microsoft.EntityFrameworkCore;

namespace Filmograf.BaseLibrary.DataAccess.DbContext;

public class DbContextBase : Microsoft.EntityFrameworkCore.DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Genre> Genres { get; set; } = null!;
    public DbSet<CollectionTag> CollectionTags { get; set; } = null!;

    public static DbContextBase MakeInstance() =>
        new DbContextBase();

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
        // todo
    }
     
    public object? GetDbSet(Type entityType)
    {
        var method = typeof(Microsoft.EntityFrameworkCore.DbContext).GetMethod(nameof(Set), Type.EmptyTypes);
        return method?.MakeGenericMethod(entityType).Invoke(this, null);
    }
}