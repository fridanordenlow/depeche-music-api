import { Response, Router } from 'express';
import { AuthenticatedRequest } from '../types/express.types.js';
import User from '../models/User.js';

export const userRouter: Router = Router();

userRouter.post('/register', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
      passwordHash: password,
    });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'New user registered successfully!',
      user: { id: savedUser._id, username: savedUser.username, email: savedUser.email },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
