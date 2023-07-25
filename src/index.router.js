import connectDB from "../DB/connection.js";
import userRouter from "./modules/user/user.router.js";
import postRouter from "./modules/post/post.router.js";
import authRouter from "./modules/auth/auth.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";

const bootstrap = async (app, express) => {
  app.use(express.json()); // convert buffer data

  // Database connection and seeding
  await connectDB();

  //Setup App Routing
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  app.use("/auth", authRouter);
  app.use("*", (req, res, next) => {
    return res.json({ message: "In-valid Routing" });
  });
  app.use(globalErrorHandling);
};

export default bootstrap;
