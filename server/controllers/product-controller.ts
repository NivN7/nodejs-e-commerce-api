import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import CustomError from "../errors";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("create product");
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("get all products");
};

export const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("get single product");
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("update product");
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("delete product");
};

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("upload image");
};
