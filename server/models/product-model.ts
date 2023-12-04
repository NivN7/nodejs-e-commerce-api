import mongoose, { Schema } from "mongoose";

interface IProduct {
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  company: string;
  colors: string[];
  featured: boolean;
  freeShipping: boolean;
  inventory: number;
  averageRating: number;
  numOfReviews: number;
  user: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [100, "Name can not be more than 100 characters"],
    },
    price: {
      type: String,
      required: [true, "Please provide product price"],
      ddefault: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/examples.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: [
        "electronics",
        "audio",
        "mobile",
        "computing",
        "wearables",
        "gaming",
        "photography",
        "smart home",
      ],
    },
    company: {
      type: String,
      required: [true, "Please provide company"],
      enum: {
        values: [
          "TechVision",
          "AudioTech",
          "MobileMasters",
          "TechHub",
          "WearTech",
          "GameMaster",
          "CaptureTech",
          "SoundScape",
          "HomeConnect",
          "FitTech",
        ],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.model("Review").deleteMany({ product: this._id });
  }
);

const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
