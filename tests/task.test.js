const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const Task = require("../src/models/task.model");

jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  await Task.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Task API", () => {
  test("should create a task", async () => {
    const payload = {
      title: "Complete assignment",
      description: "Build todo backend",
    };

    const response = await request(app).post("/api/tasks").send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body.data.title).toBe(payload.title);
    expect(response.body.data.completed).toBe(false);
  });

  test("should return validation error for empty title", async () => {
    const response = await request(app).post("/api/tasks").send({
      title: "   ",
      description: "Invalid payload",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Task title cannot be empty.");
  });

  test("should return all tasks", async () => {
    await Task.create([
      { title: "Task 1", description: "A" },
      { title: "Task 2", description: "B" },
    ]);

    const response = await request(app).get("/api/tasks");

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(2);
    expect(response.body.data).toHaveLength(2);
  });

  test("should update task details", async () => {
    const task = await Task.create({
      title: "Initial title",
      description: "Initial description",
    });

    const response = await request(app)
      .patch(`/api/tasks/${task._id}`)
      .send({
        title: "Updated title",
        category: "Work",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.title).toBe("Updated title");
    expect(response.body.data.category).toBe("Work");
  });

  test("should mark task as completed and prevent duplicate completion", async () => {
    const task = await Task.create({
      title: "Mark complete",
      description: "Test completion",
    });

    const firstResponse = await request(app).patch(`/api/tasks/${task._id}/complete`);
    expect(firstResponse.statusCode).toBe(200);
    expect(firstResponse.body.data.completed).toBe(true);

    const secondResponse = await request(app).patch(`/api/tasks/${task._id}/complete`);
    expect(secondResponse.statusCode).toBe(409);
    expect(secondResponse.body.message).toBe("Task is already marked as completed.");
  });

  test("should delete a task", async () => {
    const task = await Task.create({
      title: "Delete me",
      description: "Remove task",
    });

    const response = await request(app).delete(`/api/tasks/${task._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Task deleted successfully.");

    const taskInDb = await Task.findById(task._id);
    expect(taskInDb).toBeNull();
  });
});
