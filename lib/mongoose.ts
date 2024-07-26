import mongoose from "mongoose";

let isConnected = false; //variable to track the connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODBURI) return console.log("MongoDB URI is not defined");
  if (isConnected) return console.log("=> Using existing database connection");

  try {
    await mongoose.connect(process.env.MONGODBURI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
