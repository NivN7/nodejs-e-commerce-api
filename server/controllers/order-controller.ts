import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import CustomError from "../errors";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("create order");
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("get all Orders");
};

export const getSingleOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("get single order");
};

export const getCurrentUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("get current user orders");
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("update order");
};
