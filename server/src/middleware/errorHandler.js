export function notFound(_req, res) {
  res.status(404).json({ message: 'Endpoint not found.' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong.';

  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = `Image is too large. Maximum size is ${process.env.MAX_FILE_MB || 10} MB.`;
  }
  if (status >= 500) {
    console.error(err);
    if (process.env.NODE_ENV === 'production') message = 'Something went wrong on our side.';
  }
  res.status(status).json({ message });
}
