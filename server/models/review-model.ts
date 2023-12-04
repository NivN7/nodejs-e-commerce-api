import mongoose, { Model, Schema } from "mongoose";

interface IReview {
  rating: number;
  title: string;
  comment: string;
  user: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IReviewMethods extends Model<IReview> {
  calculateAverageRating(productId: Schema.Types.ObjectId): Promise<void>;
}

const ReviewSchema = new Schema<IReview, IReviewMethods>(
  {
    rating: {
      type: Number,
      required: [true, "Please provide rating"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (
  productId: Schema.Types.ObjectId
) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await mongoose.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  //@ts-ignore
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    //@ts-ignore
    await this.constructor.calculateAverageRating(this.product);
  }
);

const ReviewModel = mongoose.model<IReview, IReviewMethods>(
  "Review",
  ReviewSchema
);

export default ReviewModel;
