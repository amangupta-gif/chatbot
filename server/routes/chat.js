import { Router } from 'express';
import { sendMessage, chatHealth } from '../controllers/chatController.js';
import { validateApiKey } from '../middleware/auth.js';

const router = Router();

// Optional API key validation (enable in production)
// router.use(validateApiKey);

router.post('/message', sendMessage);
router.get('/health', chatHealth);

export default router;
