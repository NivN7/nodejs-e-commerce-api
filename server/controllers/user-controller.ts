import { Request, Response, NextFunction } from "express";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("get all users route");
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("get single user");
};

export const showCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("show current user");
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("update user");
};

export const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("update user password");
};
