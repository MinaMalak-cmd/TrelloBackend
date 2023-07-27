import taskModel from "../../../../DB/models/task.model.js";
import { asyncHandler, SuccessResponse } from "../../../utils/errorHandling.js";

export const addTask = asyncHandler(async (req, res, next) => {
    const { title, description, status, deadline } = req.body;
    const reqUser = req.user;
    if (!["toDo", "doing", "done"].includes(status)) {
        return next(new Error("Wrong value for status", { cause: 404 }));
    }

    const task = await taskModel.create({
        title, description, status, deadline ,
        userId: reqUser._id
    });
    return SuccessResponse(res, { message: "Done", task }, 201);
  });