import express from "express";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();


const PORT = Number(process.env.PORT) || 6000;

// PARSE HSON FILES
app.use(express.json());

// LOG THE INCOMING RE
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// HOME ROUTE
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Structured Express API"
  });
});

// TASK ROUTE
app.use("/tasks", taskRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// HANDLE ERRORS
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

// START SERVER
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});