import { Router } from "express";
import * as authController from "./controllers/auth.js";
import * as validators from "./validation.js";
import { validation } from "../../middlewares/validation.js";

const router = Router();

router.post("/signup", validation(validators.signup), authController.signup);
router.patch("/change-password", authController.changePassword);
router.post("/login", validation(validators.login), authController.login);
router.get("/confirm-email/:token", authController.confirmEmail);
router.get("/new-confirm-email/:token", authController.newConfirmEmail);
router.get("/unsubscribe/:token", authController.unSubscribe);
router.post("/forget-password", authController.forgetPassword);

export default router;
