import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { UploadedFile } from "express-fileupload";

import CustomError from "../errors";
import Product from "../models/product-model";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);

    res.status(StatusCodes.CREATED).json({ product });
  } catch (error) {
    console.error("Error in create product:", error);
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();

    res.status(StatusCodes.OK).json({ products, count: products.length });
  } catch (error) {
    console.error("Error in get all products:", error);
    next(error);
  }
};

export const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
  } catch (error) {
    console.error("Error in get single product:", error);
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: productId } = req.params;

    const product = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
  } catch (error) {
    console.error("Error in update product:", error);
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }

    await product.deleteOne();

    res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
  } catch (error) {
    console.error("Error in delete product:", error);
    next(error);
  }
};

const checkMimeType = (file: UploadedFile) => {
  return file.mimetype.startsWith("image");
};

const checkImageSize = (file: UploadedFile, maxSize: number) => {
  return file.size > maxSize;
};

const imageName = (file: UploadedFile) => {
  return file.name;
};

const moveImage = (file: UploadedFile, imagePath: string) => {
  return file.mv(imagePath);
};

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.files);

    if (!req.files) {
      throw new CustomError.BadRequestError("No File Uploaded");
    }

    if (Array.isArray(req.files.image)) {
      throw new CustomError.BadRequestError("Please Upload single file");
    }

    const productImage = req.files.image;

    if (!checkMimeType(productImage)) {
      throw new CustomError.BadRequestError("Please Upload Image");
    }

    const maxSize = 1024 * 1024;

    if (checkImageSize(productImage, maxSize)) {
      throw new CustomError.BadRequestError(
        "Please upload image smaller than 1MB"
      );
    }

    const imagePath = path.join(
      __dirname,
      "../public/uploads/" + `${imageName(productImage)}`
    );

    await moveImage(productImage, imagePath);

    res
      .status(StatusCodes.OK)
      .json({ image: `/uploads/${imageName(productImage)}` });
  } catch (error) {
    console.error("Error in upload image:", error);
    next(error);
  }
};
