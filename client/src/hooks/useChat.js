import { useState, useCallback, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const STORAGE_KEY = 'chatbot_history';

function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages) {
  try {
    // Keep last 50 messages to avoid storage bloat
    const toSave = messages.slice(-50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // Storage unavailable (private mode, etc.)
  }
}

export function useChat() {
  const [messages, setMessages] = useState(loadHistory);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isTyping) return;

    const userMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);
    setError(null);

    // Cancel previous request if still pending
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const response = await fetch(`${API_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: data.message.content,
        timestamp: data.message.timestamp,
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveHistory(finalMessages);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Failed to get response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const retryLast = useCallback(() => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (lastUser) {
      const withoutLast = messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) < messages.lastIndexOf(messages.find(msg => msg.role === 'assistant')));
      // Simpler: just trim off last AI message if exists
      const trimmed = messages[messages.length - 1]?.role === 'assistant'
        ? messages.slice(0, -1)
        : messages;
      setMessages(trimmed.slice(0, -1)); // remove last user too, re-send
      sendMessage(lastUser.content);
    }
  }, [messages, sendMessage]);

  return { messages, isTyping, error, sendMessage, clearHistory, retryLast };
}
