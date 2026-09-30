using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.DTOs;

namespace TaskManagement.IntegrationTests
{
    public class TaskControllerTests
    {
        [Fact]
        public async Task PostTask_Return201Created()
        {
            using var factory = new CustomWebApplicationFactory();
            using var client = factory.CreateClient();
            var dto = new CreateTaskDto
            {
                Title = "Integration test task",
                Description = "Testing POST endpoint",
                Status = "Pending",
                Priority = "High",
                DueDate = DateTime.Now
                
            };

            var response = await client.PostAsJsonAsync(
                "/api/tasks", dto);

            Assert.Equal(
                HttpStatusCode.Created,
                response.StatusCode
                );

            var createdTask = await response.Content.ReadFromJsonAsync<TaskResponseDto>();

            Assert.NotNull(createdTask);
            Assert.True(createdTask.ID > 0);
            Assert.Equal(dto.Title, createdTask.Title);
        }

        [Fact]
        public async Task PostTask_WithInvalidTitle_Returns400()
        {
            using var factory = new CustomWebApplicationFactory();
            using var client = factory.CreateClient();

            var dto = new CreateTaskDto
            {
                Title = "AB",
                Status = "Pending",
                Priority = "High"
            };

            var response = await client.PostAsJsonAsync(
                "/api/tasks",
                dto);

            Assert.Equal(
                HttpStatusCode.BadRequest,
                response.StatusCode
                );
        }

        [Fact]
        public async Task GetTask_WhenMissing_Returns4040()
        {
            using var factory = new CustomWebApplicationFactory();
            using var client = factory.CreateClient();
            var response = await client.GetAsync(
                "/api/tasks/999");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}
