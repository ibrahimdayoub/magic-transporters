import express, { Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import magicMoverRoutes from './routes/magicMoverRoutes';
import magicItemRoutes from './routes/magicItemRoutes';
import activityLogRoutes from './routes/activityLogRoutes';

dotenv.config();

const app: Application = express();

app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI as string;

mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.error('Error connecting to MongoDB: ', error);
});

app.use('/api/magic-movers', magicMoverRoutes);
app.use('/api/magic-items', magicItemRoutes);
app.use('/api/activity-logs', activityLogRoutes);

export default app;