namespace backend.Models.Entities
{
    public class Task
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required string Frequency { get; set; } // "daily", "weekly", "monthly"
        public string? SelectedDays { get; set; } // JSON or comma separated string for [1, 2, 3] etc.
        public string? SelectedDates { get; set; } // JSON or comma separated string for dates
        public required string Status { get; set; } = "started"; // "started", "InProgress", "completed"
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property if needed
        // public User? User { get; set; }
    }
}
