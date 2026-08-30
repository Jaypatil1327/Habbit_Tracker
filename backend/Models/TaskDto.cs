namespace backend.Models
{
    public class TaskDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required string Frequency { get; set; }
        public string? SelectedDays { get; set; }
        public string? SelectedDates { get; set; }
        public required string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateTaskDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required string Frequency { get; set; }
        public string? SelectedDays { get; set; }
        public string? SelectedDates { get; set; }
    }

    public class UpdateTaskStatusDto
    {
        public required string Status { get; set; }
    }

    public class UpdateTaskDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required string Frequency { get; set; }
        public string? SelectedDays { get; set; }
        public string? SelectedDates { get; set; }
    }
}
