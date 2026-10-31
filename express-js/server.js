import express from "express";

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from "./tasks.js";

import { validateTask } from "./middleware/validateTask.js";

// 1. CREATE EXPRESS APP
const app = express();

const PORT = Number(process.env.PORT) || 5000;

// 2. MIDDLEWARE
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 3. HOME ROUTE
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Express Task Manager API"
  });
});

// 4. GET ALL TASKS + FILTER BY COMPLETED
app.get("/tasks", async (req, res) => {
  const tasks = await getTasks();

  const { completed } = req.query;

  // No filter: return all tasks
  if (completed === undefined) {
    return res.status(200).json(tasks);
  }

  // Validate query parameter
  if (completed !== "true" && completed !== "false") {
    return res.status(400).json({
      error: "completed must be true or false"
    });
  }

  const isCompleted = completed === "true";

  const filteredTasks = tasks.filter(
    task => task.completed === isCompleted
  );

  res.status(200).json(filteredTasks);
});

// 5. GET TASK BY ID
app.get("/tasks/:id", async (req, res) => {
  const task = await getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  res.status(200).json(task);
});

// 6. CREATE TASK - WITH VALIDATION MIDDLEWARE
app.post("/tasks", validateTask, async (req, res) => {
  const task = await createTask(req.body.title.trim());

  res.status(201).json(task);
});

// 7. UPDATE TASK
app.patch("/tasks/:id", async (req, res) => {
  const body = req.body;

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return res.status(400).json({
      error: "Invalid task data"
    });
  }

  const { title, completed } = body;

  // Must provide at least one field
  if (title === undefined && completed === undefined) {
    return res.status(400).json({
      error: "Provide title or completed"
    });
  }

  // Validate title if provided
  if (
    title !== undefined &&
    (
      typeof title !== "string" ||
      title.trim().length < 3
    )
  ) {
    return res.status(400).json({
      error: "Title must contain at least 3 characters"
    });
  }

  // Validate completed if provided
  if (
    completed !== undefined &&
    typeof completed !== "boolean"
  ) {
    return res.status(400).json({
      error: "Completed must be true or false"
    });
  }

  const updates = {};

  if (title !== undefined) {
    updates.title = title.trim();
  }

  if (completed !== undefined) {
    updates.completed = completed;
  }

  const task = await updateTask(req.params.id, updates);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  res.status(200).json(task);
});

// 8. DELETE TASK
app.delete("/tasks/:id", async (req, res) => {
  const deleted = await deleteTask(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  res.status(204).send();
});

// 9. UNKNOWN ROUTES
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// 10. ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON"
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error: "Request body too large"
    });
  }

  res.status(500).json({
    error: "Internal server error"
  });
});

// 11. START SERVER
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});