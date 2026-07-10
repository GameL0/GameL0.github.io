import express from 'express';
import { postMessageController, getMessagesController, patchMessagesController, deleteMessagesController } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', postMessageController);
router.get('/', getMessagesController);
router.patch('/:id', patchMessagesController);
router.delete('/:id', deleteMessagesController);

export { router } ;