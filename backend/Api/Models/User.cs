public class User
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;
    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;
    public string Role { get; set; } = "User";

    public DateTime Created { get; set; } = DateTime.UtcNow;

    public List<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
