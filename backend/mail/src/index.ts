import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';


dotenv.config();

const app = express();
const PORT = process.env.PORT!;

app.listen(PORT, () => {
    console.log(`Mail service is running on port ${PORT}`);
});