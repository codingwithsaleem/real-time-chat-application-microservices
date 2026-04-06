import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createClient } from 'redis';
import userRoutes from './routes/user.js';
import amqp from 'amqplib';
import { connectRabbitMQ } from './config/rabitmq.js';

dotenv.config();

// Connect to MongoDB
connectDB();


//  Connect to Redis
const redisClient = createClient({
    url: process.env.REDIS_URL!
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Could not connect to Redis:', err);
    process.exit(1);
});

// connect to RabbitMQ


await connectRabbitMQ();

const app = express();
const PORT = process.env.PORT!;

//routes

app.use('/api/v1/users', userRoutes);


app.listen(PORT, () => {
    console.log(`User service is running on port ${PORT}`);
});