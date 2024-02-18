import express from "express";
import mongoose from "mongoose";
import Task from "../models/Task";
import auth, { RequestWithUser } from "../middleware/auth";

const taskRouter = express.Router();

taskRouter.post("/", auth, async (req: RequestWithUser, res, next) => {
  try {
    const task = new Task({
      user: req.user?._id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });

    await task.save();
    return res.send(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(error);
    }

    next(error);
  }
});

taskRouter.get("/", auth, async (req: RequestWithUser, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user?._id }).populate(
      "user",
      "username"
    );
    return res.send(tasks);
  } catch (e) {
    next(e);
  }
});

export default taskRouter;
