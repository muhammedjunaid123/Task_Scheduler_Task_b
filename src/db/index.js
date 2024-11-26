import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.db_url}/Task_SchRecurring`
    );
    console.log(
      `Mongodb connected DB host:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`mongo error ${error.message}`);
    process.exit(1)
  }
};

export default connectDB;
