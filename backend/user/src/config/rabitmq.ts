import ampq from 'amqplib';

let channel: ampq.Channel;


export const connectRabbitMQ = async () => {
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

        channel = await connection.createChannel();

        console.log('Connected to RabbitMQ');
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Could not connect to RabbitMQ:', err.message);
        process.exit(1);
    }
};


export const publishToQueue = async (queueName: string, message: any) => {
    if (!channel) {
        console.error('RabbitMQ channel is not initialized');
        return;
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
};