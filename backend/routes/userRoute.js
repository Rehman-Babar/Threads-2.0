import { Router } from "express";
import { GetProfile, followUnfollow, freezAccount, getSuggestedUser, logOutUser, loginUser, signupUser, updateUser } from "../controller/user.controller.js";
import protectRoute from '../middleware/protectRoutes.js'
import upload from '../utils/multer.js'

const router = Router();
router.get('/profile/:query', GetProfile)
router.get('/suggested',protectRoute, getSuggestedUser)
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.post("/follow/:id",protectRoute, followUnfollow);
router.put("/update/:id",protectRoute, updateUser);
router.put("/freez",protectRoute, freezAccount);

export default router;
