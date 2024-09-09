import express from 'express';
import {sendMessage,getConversations,getMessages} from '../controllers/messageControllers.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
const router = express.Router();
router.get('/conversations',checkAuthorization,getConversations)
router.post('/send',checkAuthorization,sendMessage)
router.get('/:id',checkAuthorization,getMessages)
export default router