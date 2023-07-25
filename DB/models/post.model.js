import { Schema, Types, model } from "mongoose";

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps:true
});

const postModel = model("Post", postSchema);

export default postModel;
