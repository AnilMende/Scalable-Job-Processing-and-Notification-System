import User from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

import jwt from "jsonwebtoken";

export const verifyAccessToken = asyncHandler(async (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        throw new ApiError(401, "Invalid token");
    }

    req.user = user;

    next();
})


export const verifyRefreshToken = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.refreshToken;

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findById(decoded.id);

    if(!user || user.refreshToken !== hashedToken){
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    req.user = user;

    //next is to pass the access to the other controller in the route
    next();
})