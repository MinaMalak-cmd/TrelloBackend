import taskModel from "../../../../DB/models/task.model.js";
import userModel from "../../../../DB/models/user.model.js";
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
  const tasks = await taskModel.find({}).populate([{
    path: "userId",
    select: "userName email phone",
  },
  {
    path: "assignedUser",
    select: "userName email phone",
  }
]);
  return SuccessResponse(res, { message: "Done", tasks }, 200);
});

export const updateTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, status, assignedUser } = req.body;
  const reqUser = req.user;
  if (!["toDo", "doing", "done"].includes(status)) {
    return next(new Error("Wrong value for status", { cause: 404 }));
  }
  const task = await taskModel.findById({ _id: id });
  if(!task) return next(new Error("In valid-id", { cause: 404 }));
  if(task?.userId?.toString() != reqUser._id) return next(new Error("Only owner can update this task", { cause: 404 }));
  if(!assignedUser) return next(new Error("Please enter assigned user", { cause: 404 }));
  const selectedUser = await userModel.findById(assignedUser);
  if(!selectedUser) return next(new Error("Please enter valid assigned Id", { cause: 404 }));
  
  const newTask = await taskModel.updateOne(
    { _id: id },
    {
      title, 
      description, 
      status, 
      assignedUser
    },
    {
      new: true,
    }
  );
  return newTask.matchedCount
    ? SuccessResponse(res, { message: "Done"}, 200 )
    : next(new Error("In valid task id", { cause: 404 }));
});
export const deleteTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const reqUser = req.user;
  const task = await taskModel.findById({ _id: id });
  if(!task) return next(new Error("In valid-id", { cause: 404 }));
  if(task?.userId?.toString() != reqUser._id) return next(new Error("Only owner can delete this task", { cause: 404 }));
  
  const deletedTask = await taskModel.deleteOne({ _id: id });
  return deletedTask.deletedCount
    ? SuccessResponse(res, { message: "Done"}, 200 )
    : next(new Error("In valid task id", { cause: 404 }));
});
