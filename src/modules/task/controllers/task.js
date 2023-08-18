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
  const tasks = await taskModel.find({}).populate([
    {
      path: "userId",
      select: "userName email phone",
    },
    {
      path: "assignedUser",
      select: "userName email phone",
    },
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
  if (!task) return next(new Error("In valid-id", { cause: 404 }));
  if (task?.userId?.toString() != reqUser._id)
    return next(new Error("Only owner can update this task", { cause: 404 }));
  if (!assignedUser)
    return next(new Error("Please enter assigned user", { cause: 404 }));
  const selectedUser = await userModel.findById(assignedUser);
  if (!selectedUser)
    return next(new Error("Please enter valid assigned Id", { cause: 404 }));

  const newTask = await taskModel.updateOne(
    { _id: id },
    {
      title,
      description,
      status,
      assignedUser,
    },
    {
      new: true,
    }
  );
  return newTask.matchedCount
    ? SuccessResponse(res, { message: "Done" }, 200)
    : next(new Error("In valid task id", { cause: 404 }));
});
export const uploadTaskAttachment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const task = await taskModel.findById(id);
  if(!task) return next(new Error("Please enter valid Task Id", { cause: 400 }));

  const attachments = [];
  for (let i = 0; i < req.files.attachment.length; i++) {
    attachments.push(req.files.attachment[i].path)
  }
  task.attachments.length ? attachments.push(...task.attachments) : attachments;
  task.attachments = attachments;
  await task.save();

  return task 
      ? SuccessResponse(res, { task }, 200 )
      : next(new Error("Can't upload attachment", { cause: 404 }));
 
});
export const deleteTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const reqUser = req.user;
  const task = await taskModel.findById({ _id: id });
  if (!task) return next(new Error("In valid-id", { cause: 404 }));
  if (task?.userId?.toString() != reqUser._id)
    return next(new Error("Only owner can delete this task", { cause: 404 }));

  const deletedTask = await taskModel.deleteOne({ _id: id });
  return deletedTask.deletedCount
    ? SuccessResponse(res, { message: "Done" }, 200)
    : next(new Error("In valid task id", { cause: 404 }));
});

export const getAllTasksForCurrentUser = asyncHandler(
  async (req, res, next) => {
    const reqUser = req.user;
    const tasks = await taskModel
      .find({
        userId: reqUser._id,
      })
      .populate([
        {
          path: "userId",
          select: "userName email phone",
        },
        {
          path: "assignedUser",
          select: "userName email phone",
        },
      ]);
    return SuccessResponse(res, { message: "Done", tasks }, 200);
  }
);

export const getAllTasksForAnyUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const tasks = await taskModel
    .find({
      userId: id,
    })
    .populate([
      {
        path: "userId",
        select: "userName email phone",
      },
      {
        path: "assignedUser",
        select: "userName email phone",
      },
    ]);
  return SuccessResponse(res, { message: "Done", tasks }, 200);
});

export const getTasksPassedDeadline = asyncHandler(async (req, res, next) => {
  const currentDate = new Date().toISOString();
  const tasks = await taskModel
    .find({
      deadline: { $lte: currentDate },
      $or: [ 
        { status: 'toDo' }, 
        { status: 'doing' } 
      ] 
    })
    .populate([
      {
        path: "userId",
        select: "userName email phone",
      },
      {
        path: "assignedUser",
        select: "userName email phone",
      },
    ]);
  return SuccessResponse(res, { message: "Done", tasks }, 200);
});