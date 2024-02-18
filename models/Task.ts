import { Schema, model, Types } from "mongoose";
import User from "./User";
const TaskSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async (value: Types.ObjectId) => {
          const user = await User.findById(value);
          return Boolean(user);
        },
        message: "User does not exist!",
      },
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "in_progres", "completed"],
      default: "new",
    },
  },
  {
    versionKey: false,
  }
);

const Task = model("Task", TaskSchema);

export default Task;
