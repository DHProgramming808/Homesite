using Microsoft.EntityFrameworkCore;


public class AuthDbContext : DbContext
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options)
        : base(options) { }

    public DbSet<User> Users{ get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
    }
}
