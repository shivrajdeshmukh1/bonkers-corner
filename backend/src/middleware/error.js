export const notFound = (req, res, next) =>
  res.status(404).json({ success: false, message: `Not found: ${req.originalUrl}` });

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Server error',
    details: err.details,
  });
};
