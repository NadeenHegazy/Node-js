import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from "../services/taskService.js";

// GET ALL TASKS
export async function getAllTasks(req, res) {
  const tasks = await getTasks();

  const { completed } = req.query;

  if (completed === undefined) {
    return res.status(200).json(tasks);
  }

  if (completed !== "true" && completed !== "false") {
    return res.status(400).json({
      error: "completed must be true or false"
    });
  }

  const filteredTasks = tasks.filter(
    task => task.completed === (completed === "true")
  );

  res.status(200).json(filteredTasks);
}

// GET TASK BY ID
export async function getSingleTask(req, res) {
  const task = await getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  res.status(200).json(task);
}

// CREATE TASK
export async function addTask(req, res) {
  const task = await createTask(req.body.title.trim());

  res.status(201).json(task);
}

// UPDATE TASK
export async function editTask(req, res) {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      error: "Invalid task data"
    });
  }

  const { title, completed } = body;

  if (title === undefined && completed === undefined) {
    return res.status(400).json({
      error: "Provide title or completed"
    });
  }

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim().length < 3)
  ) {
    return res.status(400).json({
      error: "Title must contain at least 3 characters"
    });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({
      error: "Completed must be true or false"
    });
  }

  const updates = {};

  if (title !== undefined) updates.title = title.trim();
  if (completed !== undefined) updates.completed = completed;

  const task = await updateTask(req.params.id, updates);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  res.status(200).json(task);
}

// DELETE TASK
export async function removeTask(req, res) {
  const deleted = await deleteTask(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  res.status(204).send();
}