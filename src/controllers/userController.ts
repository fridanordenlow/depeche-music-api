import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (req: Request, res: Response) => {
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
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: 'Wrong email or password' });

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) return res.status(401).json({ error: 'Wrong email or password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '12h' });
    res.json({ message: 'Login successful', token, user: { id: user._id, username: user.username } });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
