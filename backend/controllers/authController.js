import User from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

// generating the access token
function generateAccessToken(user) {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// generate the refresh token
function generateRefreshToken(user) {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// Handle User Register
export const handleRegister = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    //check if the user with the email or username already existing
    const exists = await User.findOne({ $or: [{ username }, { email }] });

    if (exists) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    //hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating user
    const user = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword
    });


    // generating the access and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //only store the refreshToken in db by hashing it
    const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    //save the hashed refresh token in place of refresh token in db
    user.refreshToken = hashedRefreshToken;
    await user.save({ validateBeforeSave: false });

    //removing the password and refreshToken
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(404, "Something went wrong while registering the user");
    }

    return res.cookie("refreshToken", refreshToken, {

        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
        .status(201)
        .json(
            new ApiResponse(201, { accessToken }, "Registered Successfully")
        )

})


// Handle User Login
export const handleLogin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    //if the user exists with the email then check the password

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    // if both the password and email are valid
    //then generate the access and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //hash the refresh token and store it in db
    const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");


    // storing the hashed refresh token in db
    user.refreshToken = hashedRefreshToken;

    await user.save({ validateBeforeSave: false });

    return res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }).status(200).json(
        new ApiResponse(200, { accessToken }, "Login Successful")
    )

})

// Handle User Logout
export const handleLogout = asyncHandler(async (req, res) => {

    const token = req.cookies?.refreshToken;

    if (token) {
        const hashedRefreshToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        //find the user with the hashed refresh token and make it null
        await User.findOneAndUpdate(
            { refreshToken: hashedRefreshToken },
            { $set: { refreshToken: null } }
        );
    }

    //then clear the refreshToken from the cookies
    return res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    })
        .status(200)
        .json(
            new ApiResponse(200, {}, "Logged Out Successfully")
        )
})

// handleRefresh for generating new access and refresh tokens
export const handleRefresh = asyncHandler(async (req, res) => {

    //we will get the user from the middleware
    const user = req.user;

    //we already know the user is valid so generate new access and refresh tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    //hash the refresh token and store it in db
    const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");

    user.refreshToken = hashedRefreshToken;

    await user.save({ validateBeforeSave: false });

    //then store the refreshToken in cookies
    return res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
        .status(201)
        .json(
            new ApiResponse(
                201,
                { accessToken: newAccessToken },
                "Access Token Refreshed"
            )
        )

})