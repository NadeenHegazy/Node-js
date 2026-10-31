import { Router } from "express";

import {
  getAllTasks,
  getSingleTask,
  addTask,
  editTask,
  removeTask
} from "../controllers/taskController.js";

import { validateTask } from "../middleware/validateTask.js";

// Router() ===> creates a smaller group of routes / 
// that we can connect to our main Express application.

const router = Router();

router.get("/", getAllTasks);

router.get("/:id", getSingleTask);

router.post("/", validateTask, addTask);

router.patch("/:id", editTask);

router.delete("/:id", removeTask);

export default router;