export function validateTask(req, res, next) {
  const { title } = req.body ?? {};

  // Check if title is valid
  if (
    typeof title !== "string" ||
    title.trim().length < 3
  ) {
    return res.status(400).json({
      error: "Title must contain at least 3 characters"
    });
  }

  // Continue to the POST route
  next();
}