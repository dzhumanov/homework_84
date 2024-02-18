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

taskRouter.put("/:id", auth, async (req: RequestWithUser, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    if (task.user.toString() !== req.user?._id.toString()) {
      return res
        .status(403)
        .send({ error: "You do not have permission to edit this task" });
    }

    if (req.body.title) {
      task.title = req.body.title;
    }
    if (req.body.description) {
      task.description = req.body.description;
    }
    if (req.body.status) {
      task.status = req.body.status;
    }
    await task.save();

    return res.send(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(error);
    }
    next(error);
  }
});

export default taskRouter;
