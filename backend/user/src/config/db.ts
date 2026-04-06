import mongoose from "mongoose";

const connectDB = async () => {
    const url = process.env.MONGO_URI!
    if (!url) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }
    try {
        const conn = await mongoose.connect(url, {
            dbName: "user-service",
        });
        console.log(`MongoDB Connected: ${conn.connection.host} ${conn.connection.name}`);
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;