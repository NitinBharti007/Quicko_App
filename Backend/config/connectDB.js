import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGODB_URI){
    throw new Error(
        "You must define the MONGODB_URI environment variable inside .env file"
    )
}

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    }
    catch(error){
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
}

export default connectDB;