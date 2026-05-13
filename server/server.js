import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js'
import authRoutes from "./routes/auth.js"
import templateRoutes from './routes/templates.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);

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