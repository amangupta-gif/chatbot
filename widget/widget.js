/**
 * ChatBot Embeddable Widget
 * 
 * Usage:
 *   <script src="https://yourdomain.com/widget/widget.js"></script>
 * 
 * With options:
 *   <script
 *     src="https://yourdomain.com/widget/widget.js"
 *     data-api-url="https://yourdomain.com"
 *     data-api-key="YOUR_API_KEY"
 *     data-theme="dark"
 *     data-position="bottom-right"
 *     data-bot-name="My Bot"
 *     data-welcome="Hello! How can I help?"
 *     data-primary-color="#6366f1">
 *   </script>
 */

(function () {
  'use strict';

  // Prevent double-load
  if (window.__chatbotWidgetLoaded) return;
  window.__chatbotWidgetLoaded = true;

  // ── Read config from script tag data attributes ──────────────────────────
  const currentScript = document.currentScript || (function () {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const config = {
    apiUrl:      currentScript.getAttribute('data-api-url')      || 'http://localhost:3001',
    apiKey:      currentScript.getAttribute('data-api-key')      || '',
    theme:       currentScript.getAttribute('data-theme')        || 'dark',
    position:    currentScript.getAttribute('data-position')     || 'bottom-right',
    botName:     currentScript.getAttribute('data-bot-name')     || 'AI Assistant',
    welcome:     currentScript.getAttribute('data-welcome')      || 'Hi there! 👋 How can I help you today?',
    primaryColor: currentScript.getAttribute('data-primary-color') || '#6366f1',
  };

  // Derive iframe URL (same origin as the widget.js script)
  const scriptSrc = currentScript.src;
  const widgetBase = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));
  const iframeSrc = `${widgetBase}/iframe.html?` + new URLSearchParams({
    api:     config.apiUrl,
    key:     config.apiKey,
    theme:   config.theme,
    name:    config.botName,
    welcome: config.welcome,
  }).toString();

  // ── Styles ───────────────────────────────────────────────────────────────
  const styles = `
    #__chatbot-widget-container * { box-sizing: border-box; }

    #__chatbot-toggle {
      position: fixed;
      ${config.position.includes('right') ? 'right: 24px;' : 'left: 24px;'}
      ${config.position.includes('top')   ? 'top: 24px;'  : 'bottom: 24px;'}
      width: 56px;
      height: 56px;
      border-radius: 18px;
      background: linear-gradient(135deg, ${config.primaryColor}, #a855f7);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483647;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
      transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
      color: white;
    }

    #__chatbot-toggle:hover {
      transform: scale(1.08);
      box-shadow: 0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15);
    }

    #__chatbot-toggle:active { transform: scale(0.94); }

    #__chatbot-toggle svg {
      transition: opacity 0.15s, transform 0.15s;
    }

    #__chatbot-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ef4444;
      color: white;
      font-size: 10px;
      font-weight: 700;
      display: none;
      align-items: center;
      justify-content: center;
      font-family: system-ui, sans-serif;
    }

    #__chatbot-panel {
      position: fixed;
      ${config.position.includes('right') ? 'right: 24px;' : 'left: 24px;'}
      ${config.position.includes('top')   ? 'top: 90px;'  : 'bottom: 90px;'}
      width: 380px;
      height: 580px;
      border-radius: 20px;
      overflow: hidden;
      z-index: 2147483646;
      box-shadow: 0 25px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
      transform-origin: ${config.position.includes('right') ? 'right' : 'left'} bottom;
      transform: scale(0.85) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
    }

    #__chatbot-panel.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    #__chatbot-iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }

    @media (max-width: 440px) {
      #__chatbot-panel {
        width: calc(100vw - 24px);
        height: 70vh;
        right: 12px !important;
        left: 12px !important;
        bottom: 80px !important;
      }
    }
  `;

  // ── Inject styles ─────────────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // ── Create toggle button ──────────────────────────────────────────────────
  const toggleBtn = document.createElement('button');
  toggleBtn.id = '__chatbot-toggle';
  toggleBtn.setAttribute('aria-label', 'Open chat');
  toggleBtn.innerHTML = `
    <svg id="__cb-icon-chat" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
    </svg>
    <svg id="__cb-icon-close" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="display:none">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
    </svg>
    <span id="__chatbot-badge"></span>
  `;

  // ── Create panel with iframe ──────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.id = '__chatbot-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat widget');

  const iframe = document.createElement('iframe');
  iframe.id = '__chatbot-iframe';
  iframe.src = iframeSrc;
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('title', config.botName);

  panel.appendChild(iframe);

  document.body.appendChild(toggleBtn);
  document.body.appendChild(panel);

  // ── Toggle logic ──────────────────────────────────────────────────────────
  let isOpen = false;

  function openWidget() {
    isOpen = true;
    panel.classList.add('open');
    document.getElementById('__cb-icon-chat').style.display = 'none';
    document.getElementById('__cb-icon-close').style.display = 'block';
    toggleBtn.setAttribute('aria-label', 'Close chat');
    // Hide unread badge
    const badge = document.getElementById('__chatbot-badge');
    badge.style.display = 'none';
  }

  function closeWidget() {
    isOpen = false;
    panel.classList.remove('open');
    document.getElementById('__cb-icon-chat').style.display = 'block';
    document.getElementById('__cb-icon-close').style.display = 'none';
    toggleBtn.setAttribute('aria-label', 'Open chat');
  }

  toggleBtn.addEventListener('click', () => {
    isOpen ? closeWidget() : openWidget();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeWidget();
  });

  // Expose public API
  window.ChatbotWidget = {
    open: openWidget,
    close: closeWidget,
    toggle: () => isOpen ? closeWidget() : openWidget(),
    config,
  };

})();
