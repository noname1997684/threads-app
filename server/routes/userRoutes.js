import express from 'express';
import checkAuthorization from '../middleware/checkAuthorization.js';
import {getSuggestedUsers,followUser,updateUser,RegisterUser,LoginUser,logoutUser,getUserProfile} from '../controllers/userControllers.js';
const router = express.Router();
router.get('/suggested',checkAuthorization,getSuggestedUsers)
router.post('/register',RegisterUser)
router.post('/login',LoginUser)
router.post('/logout',logoutUser)
router.get('/profile/:query',getUserProfile)
router.patch('/update',checkAuthorization,updateUser)
router.patch('/follow/:id',checkAuthorization,followUser)
export default router;