import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import User from "../models/user-model";
import CustomError from "../errors";
import { attachCookiesToResponse, createJWT } from "../utils";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, password, role } = req.body;

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError("Email already exists");
    }

    const user = await User.create({ email, name, password, role });
    const tokenUser = { name: user.name, userId: user._id, role: user.role };

    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({ user: tokenUser });
  } catch (error) {
    console.error("Error in registration:", error);
    next(error);
  }
};

export const login = async (req: Request, res: Response) => {
  res.send("login user");
};

export const logout = async (req: Request, res: Response) => {
  res.send("logout user");
};
