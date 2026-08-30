using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDatabaseContext : DbContext
    {
        public ApplicationDatabaseContext(DbContextOptions<ApplicationDatabaseContext> options) : base(options)
        {
            
        }

        public DbSet<Models.Entities.User> Users { get; set; }
        public DbSet<Models.Entities.Task> Tasks { get; set; }
    }
}
