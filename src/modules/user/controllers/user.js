import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler, SuccessResponse } from "../../../utils/errorHandling.js";

export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await userModel.find(
      {},
      {
        userName: 1,
        email: 1,
        phone: 1,
        age: 1,
        _id: 1,
      }
    );
    return SuccessResponse(res, { message: "Done", users }, 200);
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
  const reqUser = req.user;
  const user = await userModel.findById(reqUser._id).select('-password');
    return user
      ? SuccessResponse(res, { message: "Done", user }, 200) 
      : SuccessResponse(res, { message: "Not valid Id" }, 200);
});





export const getByNameAndAge = async (req, res, next) => {
  try {
    const { name, age } = req.query;
    const users = await userModel.find(
      {
        userName: {
          $regex: `^${name}`,
          $options: "i",
        },
        age: {
          $lt: age,
        },
      },
      {
        userName: 1,
        firstName: 1,
        lastName: 1,
        age: 1,
        email: 1,
        phone: 1,
        _id: 1,
        password: 1,
      }
    );
    return res.json({ message: "Done", users });
  } catch (error) {
    return res.json({ message: "Catch error" });
  }
};
export const getAgeBetween = async (req, res, next) => {
  try {
    const { age1, age2 } = req.query;
    const users = await userModel.find(
      {
        age: {
          $gte: age1,
          $lte: age2,
        },
      },
      {
        userName: 1,
        firstName: 1,
        lastName: 1,
        age: 1,
        email: 1,
        phone: 1,
        _id: 1,
        password: 1,
      }
    );
    return res.json({ message: "Done", users });
  } catch (error) {
    return res.json({ message: "Catch error" });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, age } = req.body;
    // const user = await userModel.findByIdAndUpdate(id,{
    //   firstName, lastName, age
    // }, {
    //   new:true
    // });
    const user = await userModel.updateOne(
      { _id: id },
      {
        firstName,
        lastName,
        age,
      },
      {
        new: true,
      }
    );
    return user.matchedCount
      ? res.json({ message: "Done" })
      : res.json({ message: "Invalid user id" });
  } catch (error) {
    return res.json({ message: "Catch error" });
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userModel.findByIdAndDelete(id);

    return user
      ? res.json({ message: "Done" })
      : res.json({ message: "Invalid user id" });
  } catch (error) {
    return error?.name === "CastError" && error?.kind === "ObjectId"
      ? res.json({ message: "Invalid user id" })
      : res.json({ message: "Catch error" });
  }
};
