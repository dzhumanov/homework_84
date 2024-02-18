import { Schema, model } from "mongoose";
const TaskSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Task = model("Task", TaskSchema);

export default Task;
