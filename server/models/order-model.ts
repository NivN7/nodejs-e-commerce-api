import mongoose, { Schema } from "mongoose";

interface ISingleOrderItem {
  name: string;
  image: string;
  price: number;
  amount: number;
  product: mongoose.Types.ObjectId;
}

interface IOrder {
  tax: number;
  shippingFee: number;
  subtotal: number;
  total: number;
  orderItems: ISingleOrderItem[];
  status: "pending" | "failed" | "paid" | "delivered" | "canceled";
  user: mongoose.Types.ObjectId;
  clientSecret: string;
  paymentIntentId?: string;
}

const SingleOrderItemSchema = new Schema<ISingleOrderItem>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
