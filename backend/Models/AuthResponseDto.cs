namespace backend.Models
{
    public class AuthResponseDto
    {
        public required string Token { get; set; }
        public required Entities.User User { get; set; }
    }
}
