import express from 'express';
import { createUser, signin , signout } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/create-user", verifyToken, createUser);
router.post("/signin", signin);
router.get('/signout',signout)
export default router;
