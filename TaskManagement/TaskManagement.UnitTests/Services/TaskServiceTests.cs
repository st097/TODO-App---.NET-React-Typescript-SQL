using Microsoft.Data.Sqlite;
using TaskManagement.Data;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Services;
using System.Reflection;
using TaskManagement.DTOs;
using System.Net.WebSockets;

namespace TaskManagement.UnitTests.Services
{
    public class TaskServiceTests
    {
        private static async Task<(AppDbContext Context, SqliteConnection Connection)> CreateDatabaseAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();

            var options = new DbContextOptionsBuilder<AppDbContext>()
                                  .UseSqlite(connection)
                                  .Options;
            var context = new AppDbContext(options);
            await context.Database.EnsureCreatedAsync();

            return (context, connection);

        }

        [Fact]
        public async Task CreateAsync_ShouldCreateTask()
        {
            //Arrange
            var (context, connection) = await CreateDatabaseAsync();

            await using var db = context;
            await using var sqlite = connection;

            var service = new TaskService(db);

            var dto = new CreateTaskDto
            {
                Title = "Learn unit testing",
                Description = "Write my first test",
                Status = "Pending",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(7)
            };

            //Act
            var result = await service.CreateAsync(dto);

            //Assert
            Assert.True(result.ID > 0);
            Assert.Equal("Learn unit testing", result.Title);
            Assert.Equal("Pending", result.Status);

            var savedTask = await db.Tasks.FindAsync(result.ID);

            Assert.NotNull(savedTask);
        }

        [Fact]
        public async Task GetByIdAsync_WhenTaskDoesNotExist_ReturnsNull()
        {
            //Arrange
            var (context, connection) = await CreateDatabaseAsync();

            await using var db = context;
            await using var sqlite = connection;

            var service = new TaskService(db);

            //Act
            var result = await service.GetByIdAsync(999);

            //Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateExistingTask()
        {
            var (context, connection) = await CreateDatabaseAsync();

            await using var db = context;
            await using var sqlite = connection;

            var service = new TaskService(db);

            var created = await service.CreateAsync(
                new CreateTaskDto
                {
                    Title = "Original title",
                    Status = "Pending",
                    Priority = "Hight",
                    DueDate = DateTime.UtcNow.AddDays(7)
                }
                );

            var updateDto = new UpdateTaskDto
            {
                Title = "Updated title",
                Status = "Completed",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(7)

            };

            //Act
            var updated = await service.UpdateAsync(created.ID, updateDto);

            //Assert
            Assert.True(updated);
            var result = await service.GetByIdAsync(created.ID);

            Assert.NotNull(result);
            Assert.Equal("Updated title", result.Title);
            Assert.Equal("Completed", result.Status);
            Assert.Equal("High", result.Priority);
           
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveExistingTask()
        {
            var (context, connection) = await CreateDatabaseAsync();

            await using var db = context;
            await using var sqlite = connection;

            var service = new TaskService(db);
            var created = await service.CreateAsync(
                new CreateTaskDto
                {
                    Title = " Task to delete",
                    Status = "Pending",
                    Priority = "Medium",
                    DueDate = DateTime.UtcNow.AddDays(7)
                });

            //Act
            var deleted = await service.DeleteAsync(created.ID);
            //Assert
            Assert.True(deleted);
            var result = await service.GetByIdAsync(created.ID);
            Assert.Null(result);
        }

    }
}
