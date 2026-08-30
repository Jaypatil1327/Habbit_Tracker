using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendTaskCompletionEmailAsync(string toEmail, string userName, string taskTitle)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var senderEmail = emailSettings["SenderEmail"];
                var smtpPassword = emailSettings["SmtpPassword"]?.Replace(" ", "");
                var smtpHost = emailSettings["SmtpHost"];
                var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
                var appName = emailSettings["AppName"] ?? "Help Desk";

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(appName, senderEmail));
                message.To.Add(new MailboxAddress(userName, toEmail));
                message.Subject = $"Congratulations on completing your task: {taskTitle}!";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <h2>Congratulations, {userName}!</h2>
                        <p>You have successfully completed the task: <strong>{taskTitle}</strong>.</p>
                        <p>Keep up the great work!</p>
                        <br/>
                        <p>Best regards,</p>
                        <p>The {appName} Team</p>"
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                // Port 587 requires StartTls
                await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(senderEmail, smtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"Task completion email sent to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail}");
            }
        }
    }
}
