import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import CustomError from "../errors";
import Product from "../models/product-model";
import Order from "../models/order-model";
import { checkPermissions } from "../utils";

interface FakeStripeAPIParams {
  amount: number;
  currency: string;
}

const fakeStripeAPI = async ({ amount, currency }: FakeStripeAPIParams) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { items: cartItems, tax, shippingFee } = req.body;

    if (!cartItems || cartItems.length < 1) {
      throw new CustomError.BadRequestError("No cart items provided");
    }

    if (!tax || !shippingFee) {
      throw new CustomError.BadRequestError(
        "Please provide tax and shipping fee"
      );
    }

    let orderItems: any = [];
    let subtotal: number = 0;

    for (const item of cartItems) {
      const dbProduct = await Product.findOne({ _id: item.product });

      if (!dbProduct) {
        throw new CustomError.NotFoundError(
          `No product with id : ${item.product}`
        );
      }

      const { name, price, image, _id } = dbProduct;

      const singleOrderItem = {
        amount: item.amount,
        name,
        price,
        image,
        product: _id,
      };

      orderItems = [...orderItems, singleOrderItem];

      subtotal += item.amount * price;

      console.log(orderItems);
      console.log(subtotal);
    }

    const total = tax + shippingFee + subtotal;

    const paymentIntent = await fakeStripeAPI({
      amount: total,
      currency: "inr",
    });

    const order = await Order.create({
      orderItems,
      total,
      subtotal,
      tax,
      shippingFee,
      clientSecret: paymentIntent.client_secret,
      user: req.user.userId,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ order, clientSecret: order.clientSecret });
  } catch (error) {
    console.log("Error in create order:", error);
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
  } catch (error) {
    console.log("Error in get all orders:", error);
    next(error);
  }
};

export const getSingleOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: orderId } = req.params;

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }

    checkPermissions(req.user, order.user);

    res.status(StatusCodes.OK).json({ order });
  } catch (error) {
    console.log("Error in get single order:", error);
    next(error);
  }
};

export const getCurrentUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
  } catch (error) {
    console.log("Error in get current user order:", error);
    next(error);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      throw new CustomError.BadRequestError("Please provide payment intent id");
    }

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }

    checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = "paid";
    await order.save();

    res.status(StatusCodes.OK).json({ order });
  } catch (error) {
    console.log("Error in update order:", error);
    next(error);
  }
};
