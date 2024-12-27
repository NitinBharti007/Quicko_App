import { Router } from "express";
import {
  loginUserController,
  logoutUserController,
  registerUserController,
  uploadAvatar,
  verifyUserController,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyUserController);
userRouter.post("/login", loginUserController);
userRouter.get("/logout", auth, logoutUserController);
userRouter.put("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);

export default userRouter;
