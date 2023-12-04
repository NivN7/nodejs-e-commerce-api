import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import CustomError from "../errors";
import Product from "../models/product-model";
import Review from "../models/review-model";
import { checkPermissions } from "../utils";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product: productId } = req.body;

    const isValidProduct = await Product.findOne({ _id: productId });

    if (!isValidProduct) {
      throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }

    const alreadySubmitted = await Review.findOne({
      product: productId,
      user: req.user.userId,
    });

    if (alreadySubmitted) {
      throw new CustomError.BadRequestError(
        `Already submitted review for this product`
      );
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);

    res.status(StatusCodes.CREATED).json({ review });
  } catch (error) {
    console.error("Error in create review:", error);
    next(error);
  }
};

export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await Review.find({})
      .populate({ path: "product", select: "name company price" })
      .populate({ path: "user", select: "name" });

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
  } catch (error) {
    console.log("Error in get all reviews:", error);
    next(error);
  }
};

export const getSingleReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
      throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }

    res.status(StatusCodes.OK).json({ review });
  } catch (error) {
    console.log("Error in get single review:", error);
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
      throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }

    checkPermissions(req.user, review.user);

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();

    res.status(StatusCodes.OK).json({ review });
  } catch (error) {
    console.log("Error in delete review:", error);
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
      throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }

    checkPermissions(req.user, review.user);
    await review.deleteOne();

    res.status(StatusCodes.OK).json({ msg: "Success! Review removed" });
  } catch (error) {
    console.log("Error in delete review:", error);
    next(error);
  }
};

export const getSingleProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: productId } = req.params;

    const reviews = await Review.find({ product: productId });

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
  } catch (error) {
    console.log("Error in get single product review:", error);
    next(error);
  }
};
