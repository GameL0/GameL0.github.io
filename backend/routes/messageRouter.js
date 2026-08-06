import express from 'express';
import { postMessageController, getMessagesController, patchMessagesController, deleteMessagesController } from '../controllers/messageController.js';
import { requireAdmin } from '../config/authMiddleware.js';

const router = express.Router();

router.post('/', postMessageController);
router.get('/', requireAdmin, getMessagesController);
router.patch('/:id', requireAdmin, patchMessagesController);
router.delete('/:id', requireAdmin, deleteMessagesController);

export { router } ;