import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler, SuccessResponse } from "../../../utils/errorHandling.js";
import sendEmail from "../../../utils/email.js";

export const signup = asyncHandler(async (req, res, next) => {
  const protocol = req.protocol;
  const host = req.headers.host;

  const { userName, email, password, cPassword, age, gender, phone } = req.body;
  if (password != cPassword) {
    return next(new Error("Password Mismatch cPassword"));
  }
  const checkMail = await userModel.findOne({ email });
  if (checkMail) return next(new Error("Email must be unique"));
  const checkPhone = await userModel.findOne({ phone });
  if (checkPhone) return next(new Error("Phone must be unique"));
  const checkUserName = await userModel.findOne({ userName });
  if (checkUserName) return next(new Error("User-name must be unique"));
  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );

  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    age,
    gender,
    phone,
  });

  const token = jwt.sign({ email: user.email, id: user._id }, process.env.EMAIL_SIGNATURE, { expiresIn: 60 * 5 });
  const link = `${protocol}://${host}/auth/confirm-email/${token}`;

  const refreshEmailToken = jwt.sign(
    { email: user.email, id: user._id },
    process.env.EMAIL_SIGNATURE,
    { expiresIn: 60 * 60 * 60 * 24 * 30 }
  );
  const refreshEmailLink = `${protocol}://${host}/auth/new-confirm-email/${refreshEmailToken}`;

  const html = `<!DOCTYPE html>
  <html>
  <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
  <style type="text/css">
  body{background-color: #88BDBF;margin: 0px;}
  </style>
  <body style="margin:0px;"> 
  <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
  <tr>
  <td>
  <table border="0" width="100%">
  <tr>
  <td>
  <h1>
      <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
  </h1>
  </td>
  <td>
  <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  <tr>
  <td>
  <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
  <tr>
  <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
  <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
  </td>
  </tr>
  <tr>
  <td>
  <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
  </td>
  </tr>
  <tr>
  <td>
  <p style="padding:0px 100px;">
  </p>
  </td>
  </tr>
  <tr>
  <td>
  <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
  </td>
  </tr>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <tr>
  <td>
  <a href="${refreshEmailLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">New Verify Email address</a>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  <tr>
  <td>
  <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
  <tr>
  <td>
  <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
  </td>
  </tr>
  <tr>
  <td>
  <div style="margin-top:20px;">

  <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
  
  <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
  </a>
  
  <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
  </a>

  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </table>
  </body>
  </html>`;
  await sendEmail({ to: user.email, subject: "Confirm User Email", html });

  return SuccessResponse(res, { message: "Done", user }, 201);
});

export const login = asyncHandler(async (req, res, next) => {
  const { userName, password, email, phone } = req.body;
  const user = await userModel.findOne({
    $or: [{ email }, { userName }, { phone }],
  });
  if (!user) {
    return next(new Error("Email not exist", { cause: 404 }));
  }
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new Error("In-valid login data", { cause: 400 }));
  }
  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SIGNATURE, {
    expiresIn: "30m",
  });
  return SuccessResponse(
    res,
    {
      message: `Hi ${user.userName}`,
      accessToken: token,
    },
    200
  );
});
// change password should be done through email
export const changePassword = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;
  if (!password) {
    return next(new Error("Missing param", { cause: 400 }));
  }
  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );

  const user = await userModel.updateOne(
    { email: email },
    {
      password: hashPassword,
    },
    {
      new: true,
    }
  );
  return user.matchedCount
    ? SuccessResponse(res, { message: "your password has been updated" }, 200)
    : next(new Error("In valid Email", { cause: 404 }));
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE);
  const user = await userModel.findByIdAndUpdate(
    decoded.id,
    { confirmEmail: true },
    { new: true }
  );
  return user
    ? res.redirect("http://localhost:4200/#/login")
    : res.send(
        `<a href="http://localhost:4200/#/signUp">Ops u look like don't have account yet to join us follow me now.</a>`
      );
});

export const newConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE);

  const user = await userModel.findById(decoded.id);
  if (!user) {
    return res.send(
      `<a href="http://localhost:4200/#/signUp">Ops u look like don't have account yet to join us follow me now.</a>`
    );
  }
  if (user.confirmEmail) {
    return res.redirect("http://localhost:4200/#/login");
  }
  const newtToken = jwt.sign({ email: user.email, id: user._id }, process.env.EMAIL_SIGNATURE, { expiresIn: 60 * 5 });
  const link = `${req.protocol}://${req.headers.host}/auth/confirm-email/${newtToken}`;

  const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`;

  await sendEmail({ to: user.email, subject: "Confirm User Email", html });
  return res.send(`<p>Check your inbox now.</p>`);
});
