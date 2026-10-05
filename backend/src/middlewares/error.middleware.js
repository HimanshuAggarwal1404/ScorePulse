// Turns thrown errors into JSON responses. Scoring rule violations carry
// their own status (400 / 404 / 409) and a message meant for the scorer.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? "Something went wrong" : err.message });
};
