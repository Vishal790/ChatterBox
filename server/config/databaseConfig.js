import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();



const connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((error) => {
      console.log("Database could not connect");
      console.log(error.message);
      process.exit(1);
    });
};

export { connect };