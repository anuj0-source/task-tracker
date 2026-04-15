# To-Do List Application (Node.js + MongoDB)

This project is a backend To-Do List application built with **Node.js**, **Express**, and **MongoDB**. It meets the assignment requirements for task management, persistence, validation, graceful error handling, and documentation.

## Features

- Create a task with title and description
- View all tasks
- Edit task details
- Delete tasks
- Mark task as completed
- Prevent completing an already completed task
- Data persistence using MongoDB
- Validation for non-empty task titles
- Meaningful API error responses
- Bonus fields:
  - `dueDate`
  - `category`

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Jest + Supertest (unit/integration tests)

## Project Structure

- `src/server.js`: application entry point
- `src/app.js`: Express app setup and middleware wiring
- `src/config/db.js`: MongoDB connection setup
- `src/models/task.model.js`: Task schema and model
- `src/controllers/task.controller.js`: route handler logic
- `src/routes/task.routes.js`: task API routes
- `src/middleware/error.middleware.js`: not-found and global error handlers
- `tests/task.test.js`: endpoint tests

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file by copying `.env.example`:

   ```bash
   copy .env.example .env
   ```

3. Update `.env` with your MongoDB URL if needed:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/todo_app
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

5. API will run at:

   ```
   http://localhost:5000
   ```

## API Endpoints

### Health

- `GET /api/health`

### Tasks

- `POST /api/tasks` - create task
- `GET /api/tasks` - list all tasks
- `PATCH /api/tasks/:id` - edit task details
- `PATCH /api/tasks/:id/complete` - mark as completed
- `DELETE /api/tasks/:id` - delete task

## Example Request Bodies

### Create Task

```json
{
  "title": "Finish internship assignment",
  "description": "Complete backend CRUD",
  "dueDate": "2026-04-20",
  "category": "Work"
}
```

### Update Task

```json
{
  "title": "Finish assignment quickly",
  "description": "Update API and tests",
  "dueDate": "2026-04-21",
  "category": "Personal"
}
```

## Running Tests

```bash
npm test
```

## Key Decisions

- Used a separate completion endpoint (`PATCH /api/tasks/:id/complete`) to clearly enforce the rule that already completed tasks cannot be completed again.
- Added centralized error middleware so all errors are returned consistently with meaningful messages.
- Used Mongoose schema validation plus explicit controller checks for clear title-validation feedback.
- Included bonus fields (`dueDate`, `category`) without affecting required functionality.

## Submission Checklist

- Create a GitHub repository.
- Commit all code and push your branch.
- Submit your GitHub repository link in the provided Google Form.
