import mongoose from "mongoose";

// Define the Task schema
const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pattern: {
      type: String,
      required: true,
      trim: true,
    },
    datas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Data",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Task_model = mongoose.model("Task", taskSchema);
export default Task_model;
