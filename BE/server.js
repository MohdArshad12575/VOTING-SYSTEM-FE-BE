import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOriginRegex.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS blocked for this origin'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options(/.*/, cors())
app.use(express.json());
app.use('/user', userRoute); //  this is mounting 
app.use('/admin', adminRoute); 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});