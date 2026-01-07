import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// Note: The .js extension is required here because I am using ESM (ECMAScript Modules)
// with 'NodeNext' resolution. TypeScript requires the extension that will exist
// in the compiled output (dist folder), even though the source file is .ts.
import { spotifyRouter } from './routes/spotifyRouter.js';
import { connectDB } from './config/db.js';
import { userRouter } from './routes/userRouter.js';
import { libraryRouter } from './routes/libraryRouter.js';

connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/spotify', spotifyRouter);
app.use('/api/users', userRouter);
app.use('/api/library', libraryRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
