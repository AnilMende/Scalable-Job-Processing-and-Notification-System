import express from "express";
import { handleLogin, handleLogout, handleRefresh, handleRegister } from "../controllers/authController.js";
import { verifyRefreshToken } from "../middleware/authMiddleware.js";

const authRouter = express.Router();


//Register api
authRouter.post("/register", handleRegister);

//login api
authRouter.post("/login", handleLogin);

//handle refresh api
//middleware validates existing refresh token in cookies
//and controller generates new access and refresh tokens
authRouter.post("/refresh-token", verifyRefreshToken, handleRefresh);

//logout api
authRouter.put("/logout", handleLogout);

export default authRouter;
