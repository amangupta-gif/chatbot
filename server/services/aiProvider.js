/**
 * AI Provider Abstraction Layer
 * 
 * Switch AI providers by changing AI_PROVIDER in .env:
 *   AI_PROVIDER=gemini   → Google Gemini
 *   AI_PROVIDER=openai   → OpenAI (GPT)
 *   AI_PROVIDER=claude   → Anthropic Claude
 *   AI_PROVIDER=custom   → Custom API endpoint
 */

import dotenv from 'dotenv';
dotenv.config();

const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

// ─────────────────────────────────────────────
// Gemini Provider
// ─────────────────────────────────────────────
async function generateGeminiResponse(messages, systemPrompt) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
    systemInstruction: systemPrompt,
  });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const lastMessage = messages[messages.length - 1];
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}

// ─────────────────────────────────────────────
// OpenAI Provider
// ─────────────────────────────────────────────
async function generateOpenAIResponse(messages, systemPrompt) {
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: formattedMessages,
    max_tokens: parseInt(process.env.MAX_TOKENS) || 1000,
  });

  return completion.choices[0].message.content;
}

// ─────────────────────────────────────────────
// Claude (Anthropic) Provider
// ─────────────────────────────────────────────
async function generateClaudeResponse(messages, systemPrompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: parseInt(process.env.MAX_TOKENS) || 1000,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}

// ─────────────────────────────────────────────
// Custom API Provider
// ─────────────────────────────────────────────
async function generateCustomResponse(messages, systemPrompt) {
  const response = await fetch(process.env.CUSTOM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CUSTOM_API_KEY}`,
    },
    body: JSON.stringify({ messages, systemPrompt }),
  });

  const data = await response.json();
  return data.response || data.content || data.message;
}

// ─────────────────────────────────────────────
// Main export — call this from your controllers
// ─────────────────────────────────────────────
export async function generateResponse(messages, systemPrompt = null) {
  const prompt = systemPrompt || (process.env.SYSTEM_PROMPT ||
    'You are a helpful, friendly AI assistant. Provide clear, concise, and accurate responses. Use markdown formatting when appropriate.');

  switch (provider) {
    case 'gemini':
      return generateGeminiResponse(messages, prompt);
    case 'openai':
      return generateOpenAIResponse(messages, prompt);
    case 'claude':
      return generateClaudeResponse(messages, prompt);
    case 'custom':
      return generateCustomResponse(messages, prompt);
    default:
      throw new Error(`Unknown AI provider: ${provider}. Use gemini, openai, claude, or custom.`);
  }
}

export function getProviderInfo() {
  return {
    provider,
    model: process.env[`${provider.toUpperCase()}_MODEL`] || 'default',
  };
}
