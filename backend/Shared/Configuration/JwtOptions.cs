public sealed class JwtOptions
{
    public string Key { get; init; } = "";
    public string Issuer { get; init; } = "";
    public string Audience { get; init; } = "";
    public bool RequireHttpsMetadata { get; init; } = true;
    public int AccessTokenMinutes { get; set; }
    public int RefreshTokenDays { get; set; }
}
