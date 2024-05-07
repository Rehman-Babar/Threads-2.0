import express from "express";
import { createPost, deletePost,  getFeedPosts, getUserPosts, getPost, likeUnlikePost, replyUser } from "../controller/post.controller.js";
import protectRoute from "../middleware/protectRoutes.js";

const router = express.Router();

router.get('/feed',protectRoute, getFeedPosts)
router.get('/:id', getPost)
router.get('/user/:userName', getUserPosts)
router.post('/create',protectRoute, createPost)
router.delete('/:id',protectRoute, deletePost)
router.put('/like/:id',protectRoute, likeUnlikePost)
router.put('/reply/:id',protectRoute, replyUser)
export default router