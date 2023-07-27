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





// export const getByNameAndAge = async (req, res, next) => {
//   try {
//     const { name, age } = req.query;
//     const users = await userModel.find(
//       {
//         userName: {
//           $regex: `^${name}`,
//           $options: "i",
//         },
//         age: {
//           $lt: age,
//         },
//       },
//       {
//         userName: 1,
//         firstName: 1,
//         lastName: 1,
//         age: 1,
//         email: 1,
//         phone: 1,
//         _id: 1,
//         password: 1,
//       }
//     );
//     return res.json({ message: "Done", users });
//   } catch (error) {
//     return res.json({ message: "Catch error" });
//   }
// };
// export const getAgeBetween = async (req, res, next) => {
//   try {
//     const { age1, age2 } = req.query;
//     const users = await userModel.find(
//       {
//         age: {
//           $gte: age1,
//           $lte: age2,
//         },
//       },
//       {
//         userName: 1,
//         firstName: 1,
//         lastName: 1,
//         age: 1,
//         email: 1,
//         phone: 1,
//         _id: 1,
//         password: 1,
//       }
//     );
//     return res.json({ message: "Done", users });
//   } catch (error) {
//     return res.json({ message: "Catch error" });
//   }
// };

export const updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { userName, age, phone } = req.body;
    // const user = await userModel.findByIdAndUpdate(id,{
    //   firstName, lastName, age
    // }, {
    //   new:true
    // });
    const user = await userModel.updateOne(
      { _id: id },
      {
        userName, 
        age, 
        phone
      },
      {
        new: true,
      }
    );
    return user.matchedCount
      ? SuccessResponse(res, { message: "Done"}, 200 )
      : next(new Error("In valid user id", { cause: 404 }));
});
export const softDelete = asyncHandler(async (req, res, next) => {
  // handle objectId cast error
  const { id } = req.params;
  console.log("🚀 ~ file: user.js:112 ~ softDelete ~ id:", id)
  const user = await userModel.updateOne(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );
  return user.matchedCount
    ? SuccessResponse(res, { message: "User has been deleted", }, 200 )
    : next(new Error("In valid user id", { cause: 404 }));
});
export const deleteUser = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);

    return user
      ? SuccessResponse(res, { message: "Done" }, 200)
      : next(new Error("In valid user id", { cause: 404 }));
});
