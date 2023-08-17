import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    enum: ['toDo', 'doing', 'done'],
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  deadline: {
    type: Date
  },
  assignedUser : {
    type: Types.ObjectId,
    ref: "User"
  },
  attachments : [String]
}, {
  timestamps:true
});

const taskModel = model("Task", taskSchema);

export default taskModel;
