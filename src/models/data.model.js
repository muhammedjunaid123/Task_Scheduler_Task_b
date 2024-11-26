import mongoose from "mongoose";

// Define the Data schema
const dataSchema = new mongoose.Schema({
  create_date: {
    type: Date,
    default: Date.now,
  },
  due_date: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  completed_date: {
    type: Date,
    default: null,
  },
  foreign_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
});

const Data_model = mongoose.model("Data", dataSchema);
export default Data_model;
