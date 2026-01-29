namespace Web.Bff.Api.Handlers;

public class CorrelationIdHandler : DelegatingHandler
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CorrelationIdHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        const string header = "X-Correlation-ID"; // TODO I don't like hardcoding this here, especially since it's shared with the middleware in Program.cs, maybe move to config

        var context = _httpContextAccessor.HttpContext;

        var correlationId = context?.Items[header]?.ToString()
            ?? context?.Request.Headers[header].FirstOrDefault();

        if (!string.IsNullOrWhiteSpace(correlationId) && !request.Headers.Contains(header))
        {
            request.Headers.Add(header, correlationId);
        }

        return base.SendAsync(request, cancellationToken);
    }

}
