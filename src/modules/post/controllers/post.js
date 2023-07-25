import postModel from "../../../../DB/models/post.model.js";
import userModel from "../../../../DB/models/user.model.js";

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await postModel.find(
      {},
      {
        userId: 1,
        title: 1,
        content: 1,
      }
    );
    return res.json({ message: "Done", posts });
  } catch (error) {
    return error?.name === "CastError" && error?.kind === "ObjectId"
      ? res.json({ message: "Invalid user id" })
      : res.json({ message: "Catch error", error });
  }
};
export const getAllPostsSorted = async (req, res, next) => {
    try {
      const posts = await postModel.find(
        {},
        {
          userId: 1,
          title: 1,
          content: 1,
        }
      ).sort({ createdAt: -1 });
      return res.json({ message: "Done", posts });
    } catch (error) {
      return error?.name === "CastError" && error?.kind === "ObjectId"
        ? res.json({ message: "Invalid user id" })
        : res.json({ message: "Catch error", error });
    }
  };
export const getAllPostsWithOwner = async (req, res, next) => {
  try {
    const posts = await postModel
      .find(
        {},
        {
          userId: 1,
          title: 1,
          content: 1,
        }
      )
      .populate({
        path: "userId",
        select: "firstName lastName userName",
      });
    return res.json({ message: "Done", posts });
  } catch (error) {
    return error?.name === "CastError" && error?.kind === "ObjectId"
      ? res.json({ message: "Invalid user id" })
      : res.json({ message: "Catch error", error });
  }
};
export const addPost = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ message: "User Not found" });
    }
    const post = await postModel.create(req.body);
    return res.json({ message: "Done", post });
  } catch (error) {
    return error?.name === "CastError" && error?.kind === "ObjectId"
      ? res.json({ message: "User Not found", error })
      : res.json({ message: "You can't add this post", error });
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { postId, userId } = req.params;
    const { title, content } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ message: "User Not found" });
    }
    const selectedPost = await postModel.findOneAndUpdate({
      _id: postId,
      userId: userId,
    }, {
        title, content 
    }, { 
        new : true
    });
    return selectedPost
      ? res.json({ message: "Done", selectedPost })
      : res.json({ message: "No post found with this data", selectedPost });
  } catch (error) {
    return error?.name === "CastError" && error?.kind === "ObjectId"
      ? res.json({ message: "User Not found", error })
      : res.json({ message: "You can't update this Post", error });
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId, userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ message: "User Not found" });
    }
    const selectedPost = await postModel.findOneAndDelete({
      _id: postId,
      userId: userId,
    });
    return selectedPost
      ? res.json({ message: "Done", selectedPost })
      : res.json({ message: "No post found with this data", selectedPost });
  } catch (error) {
    return error?.name === "CastError" && error?.kind === "ObjectId"
      ? res.json({ message: "User Not found", error })
      : res.json({ message: "You can't delete this Post", error });
  }
};
