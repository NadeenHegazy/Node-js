export function validateTask(req, res, next) {
  const { title } = req.body ?? {};

  if (
    typeof title !== "string" ||
    title.trim().length < 3
  ) {
    return res.status(400).json({
      error: "Title must contain at least 3 characters"
    });
  }

  next();
}