import { Request, Response, NextFunction } from "express";

import CustomError from "../errors";
import { isTokenValid } from "../utils";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.signedCookies.token;

    if (!token) {
      throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }

    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizePermission = (...roles: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }

    next();
  };
};
