import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-white/[0.06] dark:border-white/[0.06] border-zinc-200 p-3">
      <div className="flex items-end gap-2 glass dark:glass glass-light rounded-2xl px-3 py-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder="Ask me anything..."
          className="
            flex-1 bg-transparent resize-none outline-none border-none
            text-sm text-zinc-800 dark:text-zinc-100
            placeholder-zinc-400 dark:placeholder-zinc-500
            leading-relaxed max-h-40 py-1
            disabled:opacity-50
          "
          style={{ minHeight: '24px' }}
        />

        {/* Send button */}
        <AnimatePresence>
          <motion.button
            key={canSend ? 'active' : 'idle'}
            whileTap={{ scale: 0.88 }}
            onClick={handleSubmit}
            disabled={!canSend}
            aria-label="Send message"
            className={`
              w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5
              transition-all duration-200
              ${canSend
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30 hover:bg-indigo-500'
                : 'bg-zinc-700/50 dark:bg-zinc-700/50 bg-zinc-200 text-zinc-400 cursor-not-allowed'
              }
            `}
          >
            <svg className="w-3.5 h-3.5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2v-9" />
            </svg>
          </motion.button>
        </AnimatePresence>
      </div>

      <p className="text-center text-[10px] text-zinc-500 mt-2">
        Press <kbd className="font-mono bg-zinc-800/50 px-1 rounded text-zinc-400">Enter</kbd> to send
        &nbsp;·&nbsp;
        <kbd className="font-mono bg-zinc-800/50 px-1 rounded text-zinc-400">Shift+Enter</kbd> for newline
      </p>
    </div>
  );
}
