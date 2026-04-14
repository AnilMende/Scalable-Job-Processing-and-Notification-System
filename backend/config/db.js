import mongoose from "mongoose";

const connectDB = async () => {

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/jobs-system`);
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;