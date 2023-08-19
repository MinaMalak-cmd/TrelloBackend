import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler, SuccessResponse } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinaryConfigurations.js";
import { generateQrCode } from "../../../utils/qrCodeUtil.js";

export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await userModel.find(
      {},
      {
        userName: 1,
        email: 1,
        phone: 1,
        age: 1,
        _id: 1,
        profilePic : 1,
        coverPictures : 1
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

export const getUserData = asyncHandler(async (req, res, next) => {
  const { _id } = req.params
  const user = await userModel.findById(_id, 'userName');
  if (!user) {
    return next(new Error('in-valid userId', { cause: 400 }))
  }
  const qrcode = await generateQrCode({ data : user})
  return SuccessResponse(res, { message: "Done", user, qrcode }, 200) 
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

export const updateProfilePic = asyncHandler(async (req, res, next) => {
  // try{
    const { _id } = req.user;
    const profile = req.files?.profile;
    if(!profile){
      return next(new Error('Please upload profile picture', { cause: 400 }))
    }
    
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // this is not a best practice
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      profile[0].path, 
      {
        folder: `Users/Profiles/${_id}/Profile`,
        resource_type : 'image'
      }
    )
    // const user = await userModel.findByIdAndUpdate(
    //   _id,
    //   {
    //     profile_pic : { secure_url, public_id }
    //   },
    //   {
    //     new : true
    //   }
    // )
    const user = await userModel.findById(_id);
    if (!user) {
      await cloudinary.uploader.destroy(public_id)
      return next(new Error("Can't upload profile pic", { cause: 400 }))
    }
    let exisitingPublicId = user?.profile_pic?.public_id;

    if(exisitingPublicId){
      await cloudinary.uploader.destroy(exisitingPublicId);
    }
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1"; // you have to close this after finishing working with cloudinary
    
    user.profile_pic = { secure_url, public_id };
    await user.save();
    
    return SuccessResponse(res, { user }, 200 )

  // }catch(e){
  //   console.log("🚀 ~ file: user.js:119 ~ updateProfilePic ~ e:", e)  
  //   // error self signed certificate in certificate chain
  // }
});

export const updateCoverPictures = asyncHandler(async (req, res, next) => {
  try{
    const { _id } = req.user;
    if(!req.files?.cover){
      return next(new Error('Please upload pictures', { cause: 400 }))
    }
    const user = await userModel.findById(_id);
    if(!user){
      return next(new Error('User not existed', { cause: 400 }))
    }
    const coverImages = [];
    const publicIds = [];
    for (let i = 0; i < req.files.cover.length; i++) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.cover[i].path,
        {
          folder: `Users/Covers/${_id}`,
          resource_type : 'image'
        }
      )
      publicIds.push(public_id);
      coverImages.push({ secure_url, public_id });
    }
    user.coverPictures.length ? coverImages.push(...user.coverPictures) : coverImages;
    const newUser = await userModel.findByIdAndUpdate(
      _id,
      {
        coverPictures : coverImages
      },
      {
        new : true
      }
    )
    if (!newUser) {
      await cloudinary.api.delete_resources(publicIds)  // delete bulk of publicIds
      return next(new Error("Can't upload Cover pic", { cause: 400 }))
    }
    return SuccessResponse(res, { newUser }, 200 )
  }catch(e){
    return res.status(400).json({
      errMsg: e.message,
      stack: e.stack,
      e
    })
  }
});

export const deleteCoverPictures = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  // there is a more simple way but this to try new approach

  const user = await userModel.findById(_id);
  if(!user){
    return next(new Error('User not existed', { cause: 400 }))
  }
  const publicIds = user.coverPictures?.map(cover => cover.public_id);
  await cloudinary.api.delete_resources(publicIds)  // delete bulk of publicIds

  user.coverPictures = [];
  await user.save();
  return user
      ? SuccessResponse(res, { user }, 200 )
      : next(new Error("Can't delete cover pic", { cause: 404 }));
});

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
