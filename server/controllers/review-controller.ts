import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import CustomError from "../errors";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("create review");
};

export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("get all reviews");
};

export const getSingleReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("get single review");
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("update review");
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("delete review");
};
