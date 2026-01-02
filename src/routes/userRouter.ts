import { Router } from 'express';
import { getMe, loginUser, registerUser } from '../controllers/userController.js';
import { userAuth } from '../middlewares/userAuth.js';

export const userRouter: Router = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/me', userAuth, getMe); // Protected route to get current user info
