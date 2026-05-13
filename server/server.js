import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
<<<<<<< HEAD
import connectDB from './utils/db.js'
import authRoutes from "./routes/auth.js"
import templateRoutes from './routes/templates.js';

=======
import connectDB from './utils/db.js';
>>>>>>> 775f47ab0574944da44b56d670dbce3f64d7337f
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
<<<<<<< HEAD
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
=======
>>>>>>> 775f47ab0574944da44b56d670dbce3f64d7337f

// Test Route
app.get('/', (req, res) => {
  res.send('App is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
});