import exprss from 'express'
import protectRoute from '../middleware/protectRoutes.js'
import { GetConversation, GetMessage, SendMessage } from '../controller/message.controller.js';

const router = exprss.Router();
router.get("/conversation",protectRoute, GetConversation)
router.get("/:otherUserId",protectRoute, GetMessage)
router.post("/",protectRoute, SendMessage)


export default router;