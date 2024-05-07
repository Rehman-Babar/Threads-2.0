import mongoose from "mongoose";

const connectToDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongo_db connected");
  } catch (err) {
    console.log("mongo_db connection err", err.message);
  }
};
export default connectToDataBase;
