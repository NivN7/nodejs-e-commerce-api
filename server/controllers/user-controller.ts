import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import User from "../models/user-model";
import CustomError from "../errors";
import {
  attachCookiesToResponse,
  checkPermissions,
  createTokenUser,
} from "../utils";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.find({ role: "user" }).select("-password");
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.error("Error in get all users:", error);
    next(error);
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");

    if (!user) {
      throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
    }

    checkPermissions(req.user, user._id);

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.error("Error in get single user:", error);
    next(error);
  }
};

export const showCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(StatusCodes.OK).json({ user: req.user });
  } catch (error) {
    console.error("Error in show current user:", error);
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      throw new CustomError.BadRequestError("Please provide all values");
    }

    const user = await User.findOne({ _id: req.user.userId });

    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    user.email = email;
    user.name = name;

    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.OK).json({ user: tokenUser });
  } catch (error) {
    console.error("Error in update user:", error);
    next(error);
  }
};

export const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new CustomError.BadRequestError("Please provide both values");
    }

    const user = await User.findOne({
      _id: req.user.userId,
    });

    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
  } catch (error) {
    console.error("Error in update user password:", error);
    next(error);
  }
};
