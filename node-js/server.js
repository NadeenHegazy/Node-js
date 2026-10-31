// This file receives HTTP requests, validates incoming data, calls functions from tasks.js, and sends responses.

import http from "node:http";

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from "./tasks.js";

const PORT = Number(process.env.PORT) || 3000;

// Send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify(data));
}

// Read JSON request body
async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  const MAX_BODY_SIZE = 10_000;

  for await (const chunk of req) {
    size += chunk.length;

    if (size > MAX_BODY_SIZE) {
      const error = new Error("Request body too large");
      error.statusCode = 413;
      throw error;
    }

    chunks.push(chunk);
  }

  const text = Buffer.concat(chunks).toString("utf8");

  return JSON.parse(text);
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = url.pathname;

    // 1. GET ALL TASKS
    if (req.method === "GET" && pathname === "/tasks") {
      const tasks = await getTasks();

      return sendJson(res, 200, tasks);
    }

    // 2. POST - CREATE TASK
    if (req.method === "POST" && pathname === "/tasks") {
      const body = await readJsonBody(req);

      if (
        !body ||
        typeof body.title !== "string" ||
        body.title.trim().length < 3
      ) {
        return sendJson(res, 400, {
          error: "Title must contain at least 3 characters"
        });
      }

      const task = await createTask(body.title.trim());

      return sendJson(res, 201, task);
    }

    // Extract task ID from /tasks/:id
    const match = pathname.match(/^\/tasks\/([^/]+)$/);

    // 3. GET SPECIFIC TASK BY ID
    if (req.method === "GET" && match) {
      const id = match[1];

      const task = await getTaskById(id);

      if (!task) {
        return sendJson(res, 404, {
          error: "Task not found"
        });
      }

      return sendJson(res, 200, task);
    }

    // 4. PATCH - UPDATE TASK
    if (req.method === "PATCH" && match) {
      const id = match[1];
      const body = await readJsonBody(req);

      if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body)
      ) {
        return sendJson(res, 400, {
          error: "Invalid task data"
        });
      }

      const { title, completed } = body;

      if (title === undefined && completed === undefined) {
        return sendJson(res, 400, {
          error: "Provide title or completed"
        });
      }

      if (
        title !== undefined &&
        (typeof title !== "string" || title.trim().length < 3)
      ) {
        return sendJson(res, 400, {
          error: "Title must contain at least 3 characters"
        });
      }

      if (
        completed !== undefined &&
        typeof completed !== "boolean"
      ) {
        return sendJson(res, 400, {
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

      const task = await updateTask(id, updates);

      if (!task) {
        return sendJson(res, 404, {
          error: "Task not found"
        });
      }

      return sendJson(res, 200, task);
    }

    // 5. DELETE TASK
    if (req.method === "DELETE" && match) {
      const id = match[1];

      const deleted = await deleteTask(id);

      if (!deleted) {
        return sendJson(res, 404, {
          error: "Task not found"
        });
      }

      res.writeHead(204);
      return res.end();
    }

    // Route not found
    return sendJson(res, 404, {
      error: "Route not found"
    });

  } catch (error) {
    console.error(error);

    if (res.headersSent) {
      return res.end();
    }

    if (error.statusCode === 413) {
      return sendJson(res, 413, {
        error: "Request body too large"
      });
    }

    if (error instanceof SyntaxError) {
      return sendJson(res, 400, {
        error: "Invalid JSON"
      });
    }

    return sendJson(res, 500, {
      error: "Internal server error"
    });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});