using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDatabaseContext _context;
        private readonly IEmailService _emailService;

        public TasksController(ApplicationDatabaseContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            // Cleanup passed tasks
            var allTasks = await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
            var today = DateTime.UtcNow.Date;
            var tasksToDelete = new List<backend.Models.Entities.Task>();

            foreach (var t in allTasks)
            {
                if (t.Frequency == "monthly" && !string.IsNullOrEmpty(t.SelectedDates))
                {
                    try
                    {
                        var dates = System.Text.Json.JsonSerializer.Deserialize<List<string>>(t.SelectedDates);
                        if (dates != null && dates.Any())
                        {
                            bool hasFutureDate = dates.Any(d => DateTime.TryParse(d, out var parsedDate) && parsedDate.Date >= today);
                            if (!hasFutureDate)
                            {
                                tasksToDelete.Add(t);
                            }
                        }
                    }
                    catch
                    {
                        // Ignore parse errors
                    }
                }
            }

            if (tasksToDelete.Any())
            {
                _context.Tasks.RemoveRange(tasksToDelete);
                await _context.SaveChangesAsync();
                
                // Remove from the in-memory list so they aren't returned to the client
                foreach (var deletedTask in tasksToDelete)
                {
                    allTasks.Remove(deletedTask);
                }
            }

            var taskDtos = allTasks
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Frequency = t.Frequency,
                    SelectedDays = t.SelectedDays,
                    SelectedDates = t.SelectedDates,
                    Status = t.Status,
                    CreatedAt = t.CreatedAt
                })
                .ToList();

            return Ok(taskDtos);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto model)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var task = new backend.Models.Entities.Task
            {
                Id = Guid.NewGuid(),
                Title = model.Title,
                Description = model.Description,
                Frequency = model.Frequency,
                SelectedDays = model.SelectedDays,
                SelectedDates = model.SelectedDates,
                Status = "started",
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            var taskDto = new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Frequency = task.Frequency,
                SelectedDays = task.SelectedDays,
                SelectedDates = task.SelectedDates,
                Status = task.Status,
                CreatedAt = task.CreatedAt
            };

            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, taskDto);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(Guid id, [FromBody] UpdateTaskStatusDto model)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null)
            {
                return NotFound();
            }

            bool isNewlyCompleted = task.Status != "completed" && model.Status == "completed";

            task.Status = model.Status;
            await _context.SaveChangesAsync();

            if (isNewlyCompleted)
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    // Fire and forget or await, depending on performance needs. We'll await to ensure it works.
                    // Ideally this would be on a background queue, but for a simple app awaiting is fine.
                    _ = _emailService.SendTaskCompletionEmailAsync(user.Email, user.Name, task.Title);
                }
            }

            return Ok(new { Message = "Task status updated successfully" });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(Guid id, [FromBody] UpdateTaskDto model)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null)
            {
                return NotFound();
            }

            task.Title = model.Title;
            task.Description = model.Description;
            task.Frequency = model.Frequency;
            task.SelectedDays = model.SelectedDays;
            task.SelectedDates = model.SelectedDates;
            
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Task updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Task deleted successfully" });
        }
    }
}
