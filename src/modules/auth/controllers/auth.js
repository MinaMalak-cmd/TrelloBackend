import bcrypt from "bcryptjs";

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
export const login = async (req, res, next) => {
  try {
    const { userName, password, email, phone } = req.body;
    const user = await userModel.findOne({
      $or: [{ email }, { userName }, { phone }]
    });
    if (!user) {
      return res.json({ message: "Email not exist" });
    }
    const match = bcrypt.compareSync(password, user.password);
    if(!match){
      return res.json({ message: "Please enter valid credentials" });
    }
    return res.json({
      message: `Hi ${user.firstName} ${user.lastName}`
    });
  } catch (error) {
    return res.json({ message: "Catch error" });
  }
};
