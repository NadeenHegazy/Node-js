// Notice that tasks.js doesn't know anything about HTTP methods or status codes.
//  It only handles the data.

import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

const filePath = new URL("./tasks.json", import.meta.url);

// GET ALL TASKS
export async function getTasks() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

// SAVE TASKS TO FILE
async function saveTasks(tasks) {
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));
}

// GET TASK BY ID
export async function getTaskById(id) {
  const tasks = await getTasks();

  return tasks.find((task) => task.id === id) ?? null;
}

// CREATE TASK
export async function createTask(title) {
  const tasks = await getTasks();

  const newTask = {
    id: randomUUID(),
    title,
    completed: false
  };

  tasks.push(newTask);

  await saveTasks(tasks);

  return newTask;
}

// UPDATE TASK
export async function updateTask(id, updates) {
  const tasks = await getTasks();

  const task = tasks.find((task) => task.id === id);

  if (!task) return null;

  if (updates.title !== undefined) {
    task.title = updates.title;
  }

  if (updates.completed !== undefined) {
    task.completed = updates.completed;
  }

  await saveTasks(tasks);

  return task;
}

// DELETE TASK
export async function deleteTask(id) {
  const tasks = await getTasks();

  const remainingTasks = tasks.filter((task) => task.id !== id);

  if (remainingTasks.length === tasks.length) {
    return false;
  }

  await saveTasks(remainingTasks);

  return true;
}