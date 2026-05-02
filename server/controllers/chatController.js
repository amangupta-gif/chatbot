import { generateResponse, getProviderInfo } from '../services/aiProvider.js';

/**
 * POST /api/chat/message
 * Handles incoming chat messages and returns AI response
 */
export async function sendMessage(req, res, next) {
  try {
    const { messages, systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Validate last message is from user
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'user' || !lastMsg.content?.trim()) {
      return res.status(400).json({ error: 'Last message must be a non-empty user message' });
    }

    // Limit conversation history to last 20 messages for token efficiency
    const trimmedMessages = messages.slice(-20);

    const response = await generateResponse(trimmedMessages, systemPrompt);

    res.json({
      success: true,
      message: {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      },
      provider: getProviderInfo(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/chat/health
 * Returns AI provider status
 */
export function chatHealth(req, res) {
  res.json({
    status: 'ok',
    provider: getProviderInfo(),
    timestamp: new Date().toISOString(),
  });
}
