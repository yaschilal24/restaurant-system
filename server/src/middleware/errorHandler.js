function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const message = err.isOperational ? err.message : 'Internal server error';
  if (process.env.NODE_ENV === 'development') console.error('❌', err);
  res.status(status).json({
    success: false, message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
module.exports = errorHandler;