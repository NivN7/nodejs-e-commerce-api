import express from "express";
import dotenv from "dotenv";

import connectDB from "./db/connect";
import { notFoundMiddleware } from "./middleware/not-found";
import { errorHandlerMiddleware } from "./middleware/error-handler";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

app.get("/", (req, res) => {
  res.send("E-commerce API");
});

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
