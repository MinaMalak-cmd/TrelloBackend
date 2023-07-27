import taskModel from "../../../../DB/models/task.model.js";
import { asyncHandler, SuccessResponse } from "../../../utils/errorHandling.js";

export const addTask = asyncHandler(async (req, res, next) => {
  const { title, description, status, deadline } = req.body;
  const reqUser = req.user;
  if (!["toDo", "doing", "done"].includes(status)) {
    return next(new Error("Wrong value for status", { cause: 404 }));
  }

  const task = await taskModel.create({
    title,
    description,
    status,
    deadline,
    userId: reqUser._id,
  });
  return SuccessResponse(res, { message: "Done", task }, 201);
});

export const getAllTasksWithUserData = asyncHandler(async (req, res, next) => {
  const tasks = await taskModel.find({}).populate({
    path: "userId",
    select: "userName email phone",
  });
  return SuccessResponse(res, { message: "Done", tasks }, 200);
});

export const updateTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, status, assignedUser } = req.body;
  const reqUser = req.user;
  if (!["toDo", "doing", "done"].includes(status)) {
    return next(new Error("Wrong value for status", { cause: 404 }));
  }
  // const userToAssign = await userModel.findById()
  const task = await taskModel.findById({ _id: id });
  if(!task) return next(new Error("In valid-id", { cause: 404 }));
  if(task?.userId?.toString() != reqUser._id) return next(new Error("Only owner can update this note", { cause: 404 }));

  //check if assignTo id is valid id and not owner id 
  // then add your update request
});
