# To-Do List Application (Node.js + MongoDB + Frontend)

This is a full To-Do List application using a Node.js + Express backend, MongoDB persistence, and a responsive frontend UI.

## Features

- Create tasks with title and description
- View all tasks in a clean dashboard
- Edit task details
- Delete tasks
- Mark tasks as completed
- Prevent marking a task complete if it is already completed
- Store and retrieve tasks from MongoDB
- Validate that title is not empty
- Return meaningful API error messages
- Bonus fields:
  - dueDate
  - category

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- HTML, CSS, Vanilla JavaScript frontend

## Project Structure

- src/server.js: backend entry point
- src/app.js: app setup, middleware, static frontend hosting
- src/config/db.js: MongoDB connection logic
- src/models/task.model.js: task schema and model
- src/controllers/task.controller.js: API business logic
- src/routes/task.routes.js: task routes
- src/middleware/error.middleware.js: global API error handling
- public/index.html: frontend markup
- public/styles.css: frontend styling
- public/app.js: frontend behavior and API integration

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a .env file in the project root:

   ```bash
   echo PORT=5000> .env
   echo MONGODB_URI=mongodb://127.0.0.1:27017/todo_app>> .env
   ```

3. Configure environment values:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/todo_app
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open the application in your browser:

   ```text
   http://localhost:5000
   ```

## API Endpoints

- GET /api/health
- POST /api/tasks
- GET /api/tasks
- PATCH /api/tasks/:id
- PATCH /api/tasks/:id/complete
- DELETE /api/tasks/:id

## Key Decisions

- The complete action is handled by a dedicated endpoint so the app can explicitly block duplicate completion attempts.
- Validation is enforced in both controller logic and schema rules for better reliability and error clarity.
- Frontend and backend are served from the same Express app to keep local setup simple.
