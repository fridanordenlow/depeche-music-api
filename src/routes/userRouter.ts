import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';

export const userRouter: Router = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
