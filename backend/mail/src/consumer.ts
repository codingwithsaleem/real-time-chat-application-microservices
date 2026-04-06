import ampq from 'amqplib';
import nodemailer from 'nodemailer';
import env from 'dotenv';

env.config();


export const startSendOtpConsumer = async () => {
    const url = process.env.RABBITMQ_HOST!;
    if (!url) {
        console.error('RABBITMQ_HOST is not defined in environment variables');
        process.exit(1);
    }
    try {
        const connection = await ampq.connect(
          { 
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST!,
            port: Number(process.env.RABBITMQ_PORT!) || 5671,
            username: process.env.RABBITMQ_USERNAME!,
            password: process.env.RABBITMQ_PASSWORD!,
          }
        );
        const channel = await connection.createChannel();
        const queueName = 'send_otp_queue';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Waiting for messages in %s. To exit press CTRL+C', queueName);

        channel.consume(queueName, async (msg) => {
            if (msg) {
                const messageContent = msg.content.toString();
                console.log('Received message:', messageContent);
                const { email, otp } = JSON.parse(messageContent);
                await sendOtpEmail(email, otp);
                channel.ack(msg);
            }
        });
    }
    catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Error in send OTP consumer:', err.message);
        process.exit(1);
    }
};

const sendOtpEmail = async (email: string, otp: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST!,
            port: Number(process.env.EMAIL_PORT!) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER!,
                pass: process.env.EMAIL_PASS!,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Error sending OTP email:', err.message);
    }
};