import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import connectDB from "./db/connect";
import { notFoundMiddleware } from "./middleware/not-found";
import { errorHandlerMiddleware } from "./middleware/error-handler";
import authRouter from "./routes/auth-route";
import userRouter from "./routes/user-route";
import productRouter from "./routes/product-route";

dotenv.config();

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static("./public"));
app.use(fileUpload());

const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("E-commerce API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    if (MONGO_URL) {
      await connectDB(MONGO_URL).then(() => {
        console.log("Connected to MongoDB!");
      });
    }

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
