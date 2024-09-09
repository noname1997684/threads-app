import express from 'express';
import {deletePost,getFeedPosts,getPost, createPost,getUserPosts,likePost,commentPost } from '../controllers/postControllers.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
const router = express.Router();

router.post('/create',checkAuthorization,createPost)
router.get('/getpost/:id',getPost)
router.get('/user/:username',getUserPosts)
router.patch('/like/:id',checkAuthorization,likePost)
router.patch('/comment/:id',checkAuthorization,commentPost)
router.get('/feed',getFeedPosts)
router.delete('/delete/:id',checkAuthorization,deletePost)
export default router