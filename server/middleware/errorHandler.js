export function errorHandler(err, req, res, next) {
  console.error('Server error:', err.message);

  // AI provider errors
  if (err.message?.includes('API key')) {
    return res.status(401).json({ error: 'AI provider authentication failed. Check your API key.' });
  }

  if (err.message?.includes('quota') || err.message?.includes('rate')) {
    return res.status(429).json({ error: 'AI provider rate limit exceeded. Try again shortly.' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
