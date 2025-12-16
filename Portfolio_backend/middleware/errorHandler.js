export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.message);

  res.status(res.statusCode !== 200 ? res.statusCode : 500).json({
    message: err.message,
  });
};
