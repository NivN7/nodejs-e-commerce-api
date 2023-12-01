import express from "express";
import dotenv from "dotenv";

import connectDB from "./db/connect";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

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
