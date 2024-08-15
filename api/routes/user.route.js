import express from 'express';
import { getUserListings, updateUser,getUsers,deleteUser,countUsers,countRoles } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.put('/update/:id', verifyToken, updateUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/get-users' , getUsers)
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/count-users', countUsers);
router.get('/count-roles', countRoles);
export default router;
