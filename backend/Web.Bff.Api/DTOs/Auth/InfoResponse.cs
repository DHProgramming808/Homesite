// TODO flesh out when we properly implement Info endpoint
 namespace Web.Bff.Api.DTOs.Auth;

 public class InfoResponse
 {
     public string Version { get; set; } = null!;
     public string Name { get; set; } = null!;
     //public string Description { get; set; } = null!; // TODO add more fields as necessary
     public string Framework { get; set; } = null!;
     public string Status { get; set; } = null!; // TODO flesh out more if needed
 }
