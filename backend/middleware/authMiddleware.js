import User from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

import jwt from "jsonwebtoken";


export const verifyRefreshToken = asyncHandler( async(req, res, next) => {

    const token = req.cookies?.refreshToken;

    if(!token){
        throw new ApiError(401, "Unauthorized");
    }

    //refreshToken avialable then hash it
    const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    const user = await User.findOne({ refreshToken : hashedToken });

    if(!user){
        throw new ApiError(401, "Invalid refresh token");
    }

    //user exists with the refresh token then verify the token with jwt

    try {

        jwt.verify(token , process.env.REFRESH_TOKEN_SECRET);
        
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    //if both user and token are valid then add them with request
    req.user = user;
    req.refreshToken = token;

    //next is to pass the access to the other controller in the route
    next();
})