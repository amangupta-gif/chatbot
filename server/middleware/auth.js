/**
 * API Key Authentication Middleware
 * 
 * Enable by uncommenting router.use(validateApiKey) in routes/chat.js
 * Set VALID_API_KEYS in .env as comma-separated list
 */
export function validateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const validKeys = (process.env.VALID_API_KEYS || '').split(',').map(k => k.trim()).filter(Boolean);

  // If no keys configured, allow all (dev mode)
  if (validKeys.length === 0) return next();

  if (!apiKey || !validKeys.includes(apiKey)) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }

  next();
}
