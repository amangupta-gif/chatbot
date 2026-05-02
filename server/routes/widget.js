import { Router } from 'express';

const router = Router();

// Widget config endpoint — clients can fetch dynamic config
router.get('/config', (req, res) => {
  res.json({
    welcomeMessage: process.env.WELCOME_MESSAGE || 'Hi there! 👋 How can I help you today?',
    botName: process.env.BOT_NAME || 'AI Assistant',
    theme: process.env.DEFAULT_THEME || 'dark',
    primaryColor: process.env.PRIMARY_COLOR || '#6366f1',
    position: process.env.WIDGET_POSITION || 'bottom-right',
  });
});

export default router;
