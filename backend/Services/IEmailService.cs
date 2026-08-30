namespace backend.Services
{
    public interface IEmailService
    {
        Task SendTaskCompletionEmailAsync(string toEmail, string userName, string taskTitle);
    }
}
