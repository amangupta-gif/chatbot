import { ChatWidget } from './components/ChatWidget.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-[#080810] dark:bg-[#080810] bg-zinc-50 flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden dark:block hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Demo content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI-Powered Chatbot Widget
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-100 dark:text-zinc-100 text-zinc-800 mb-4 leading-tight tracking-tight">
            Your AI Assistant,
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Everywhere
            </span>
          </h1>

          <p className="text-lg text-zinc-400 dark:text-zinc-400 text-zinc-600 mb-8 leading-relaxed">
            A production-ready, embeddable AI chatbot widget. Drop it into any website with a single script tag. Powered by Gemini, OpenAI, or Claude.
          </p>

          <div className="glass rounded-2xl p-5 text-left mb-8">
            <p className="text-xs text-zinc-500 mb-2 font-mono">Embed with one line:</p>
            <code className="text-sm text-indigo-300 font-mono">
              {'<script src="https://yourdomain.com/widget/widget.js"></script>'}
            </code>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            {[
              { icon: '🤖', label: 'Multi-Provider', desc: 'Gemini, GPT, Claude' },
              { icon: '🎨', label: 'Themeable', desc: 'Dark & light modes' },
              { icon: '⚡', label: 'Production Ready', desc: 'Rate limiting, auth' },
            ].map(f => (
              <div key={f.label} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="font-semibold text-zinc-200 dark:text-zinc-200 text-zinc-700 text-xs">{f.label}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-zinc-600">
        💬 Click the button below to try the chatbot widget!
      </footer>

      {/* The actual widget */}
      <ChatWidget />
    </div>
  );
}
