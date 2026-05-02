# 🤖 AI ChatBot Widget — Production Ready

A beautiful, embeddable AI chatbot widget you can integrate into **any website with a single script tag**. Supports Gemini, OpenAI, Claude, or custom AI backends.

![ChatBot Widget Preview](https://placehold.co/800x400/0f0f13/6366f1?text=AI+ChatBot+Widget)

---

## ✨ Features

- 🎨 **Modern UI** — Glassmorphism dark/light theme with smooth animations
- 🤖 **Multi-Provider AI** — Gemini, OpenAI, Claude, or custom API
- 📱 **Fully Responsive** — Works on mobile & desktop
- 🧩 **One-Line Embed** — Drop into any site instantly
- 💬 **Markdown Support** — Code blocks, formatting, links
- 💾 **Chat Persistence** — History saved in localStorage
- ⚡ **Rate Limiting** — Built-in protection against abuse
- 🌙 **Dark/Light Mode** — User-toggleable themes

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all (server + client)
cd chatbot-project
npm install         # root tools
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment

```bash
# Copy example env files
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` and add your AI API key:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

### 3. Start the Server

```bash
cd server
npm run dev
# Server runs at http://localhost:3001
```

### 4. Start the Frontend (optional — for the demo page)

```bash
cd client
npm run dev
# Demo app runs at http://localhost:5173
```

---

## 🤖 AI Provider Setup

Change `AI_PROVIDER` in `server/.env` to switch models:

### Google Gemini (Default — Free Tier Available)
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.0-flash-lite
```
Get key: https://aistudio.google.com/app/apikey

### OpenAI (GPT)
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
```
Get key: https://platform.openai.com/api-keys

### Anthropic Claude
```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your_anthropic_key
CLAUDE_MODEL=claude-haiku-4-5-20251001
```
Get key: https://console.anthropic.com

### Custom API
```env
AI_PROVIDER=custom
CUSTOM_API_URL=https://your-api.com/chat
CUSTOM_API_KEY=your_key
```

---

## 🧩 Widget Embedding

Embed on **any website** with one line:

```html
<script src="http://localhost:3001/widget/widget.js"></script>
```

### Advanced Configuration

```html
<script
  src="http://localhost:3001/widget/widget.js"
  data-api-url="http://localhost:3001"
  data-api-key="YOUR_API_KEY"
  data-theme="dark"
  data-position="bottom-right"
  data-bot-name="Support Bot"
  data-welcome="Hello! How can I help you today?"
  data-primary-color="#6366f1">
</script>
```

### Widget Options

| Attribute | Default | Description |
|---|---|---|
| `data-api-url` | `http://localhost:3001` | Your server URL |
| `data-api-key` | *(empty)* | API key for authentication |
| `data-theme` | `dark` | `dark` or `light` |
| `data-position` | `bottom-right` | `bottom-right`, `bottom-left` |
| `data-bot-name` | `AI Assistant` | Display name |
| `data-welcome` | Hi there!... | Welcome message |
| `data-primary-color` | `#6366f1` | Button/accent color |

### JavaScript API

```javascript
// Control widget programmatically
ChatbotWidget.open();
ChatbotWidget.close();
ChatbotWidget.toggle();
```

---

## 📁 Project Structure

```
chatbot-project/
├── client/                     # React frontend (demo page)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWidget.jsx      # Floating widget wrapper
│   │   │   ├── ChatWindow.jsx      # Main chat panel
│   │   │   ├── MessageBubble.jsx   # Individual message
│   │   │   ├── ChatInput.jsx       # Input area
│   │   │   ├── TypingIndicator.jsx # Animated typing dots
│   │   │   └── MarkdownRenderer.jsx # Markdown + code highlighting
│   │   ├── hooks/
│   │   │   ├── useChat.js          # Chat state & API calls
│   │   │   └── useTheme.js         # Dark/light mode
│   │   └── styles/
│   │       └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express backend
│   ├── routes/
│   │   ├── chat.js             # /api/chat routes
│   │   └── widget.js           # /api/widget routes
│   ├── controllers/
│   │   └── chatController.js   # Request handlers
│   ├── services/
│   │   └── aiProvider.js       # 🔑 AI abstraction layer
│   ├── middleware/
│   │   ├── auth.js             # API key validation
│   │   ├── rateLimiter.js      # Rate limiting
│   │   └── errorHandler.js     # Error formatting
│   ├── index.js
│   └── .env.example
│
├── widget/                     # Embeddable widget system
│   ├── widget.js               # Single-script embed loader
│   └── iframe.html             # Isolated chat UI (no React needed)
│
├── package.json
└── README.md
```

---

## 🔐 Security

### Enable API Key Authentication

1. Add keys to `server/.env`:
   ```env
   VALID_API_KEYS=key1,key2,key3
   ```

2. Uncomment in `server/routes/chat.js`:
   ```js
   router.use(validateApiKey);
   ```

3. Pass key in widget:
   ```html
   <script data-api-key="key1" src="..."></script>
   ```

### Rate Limiting

Default: 30 requests/minute per IP. Adjust in `.env`:
```env
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=30
```

---

## 🎨 Customization

### Change AI System Prompt

```env
SYSTEM_PROMPT=You are a customer support agent for AcmeCorp. Be helpful and professional.
```

### Customize Bot Personality

```env
BOT_NAME=Aria
WELCOME_MESSAGE=Hi! I'm Aria, your AcmeCorp assistant. How can I help?
```

### Switch AI Provider

Just change `AI_PROVIDER` in `.env` — no code changes needed.

---

## 🚢 Production Deployment

### Deploy Server (Node.js)

1. Set `NODE_ENV=production` in `.env`
2. Deploy to Railway, Render, Fly.io, or any Node.js host
3. Update `data-api-url` in your script tag to the production URL

### Deploy Widget Files

Upload `widget/widget.js` and `widget/iframe.html` to your server or CDN.

```html
<!-- Production embed -->
<script
  src="https://your-server.com/widget/widget.js"
  data-api-url="https://your-server.com"
  data-api-key="your_production_key">
</script>
```

---

## 🛠 Development

```bash
# Run everything concurrently (from root)
npm run dev

# Individual
npm run dev:server   # just the server
npm run dev:client   # just the React demo
```

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/chat/message` | Send a message |
| `GET` | `/api/chat/health` | AI provider status |
| `GET` | `/api/widget/config` | Widget configuration |
| `GET` | `/health` | Server health |
| `GET` | `/widget/widget.js` | Embeddable widget |
| `GET` | `/widget/iframe.html` | Widget UI |

---

## 📝 License

MIT — Use freely in personal and commercial projects.
