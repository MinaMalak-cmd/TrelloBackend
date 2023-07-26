import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler, SuccessResponse } from "../../../utils/errorHandling.js";

export const signup = asyncHandler(async (req, res, next) => {
    const {
      userName,
      email,
      password,
      cPassword,
      age,
      gender,
      phone,
    } = req.body;
    if (password != cPassword) {
      return next(new Error("Password Mismatch cPassword" ))
    }
    const checkMail = await userModel.findOne({ email });
    if (checkMail) return next(new Error("Email must be unique"))
    const checkPhone = await userModel.findOne({ phone });
    if (checkPhone) return next(new Error("Phone must be unique" ))
    const checkUserName = await userModel.findOne({ userName });
    if (checkUserName) return next(new Error("User-name must be unique" ))
    const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));

    const user = await userModel.create({
      userName,
      email,
      password: hashPassword,
      age,
      gender,
      phone,
    });
    return SuccessResponse(res, { message: "Done", user }, 201)
});
export const login = asyncHandler(async (req, res, next) => {
    const { userName, password, email, phone } = req.body;
    const user = await userModel.findOne({
      $or: [{ email }, { userName }, { phone }]
    });
    if (!user) {
      return next(new Error("Email not exist", { cause: 404 }));
    }
    const match = bcrypt.compareSync(password, user.password);
    if(!match){
      return next(new Error("In-valid login data", { cause: 400}))
    }
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SIGNATURE, { expiresIn : '10m'});
    return SuccessResponse(res, {
      message: `Hi ${user.userName}`,
      accessToken : token 
    }, 200)
    
});

