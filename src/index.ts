import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user-routes";

dotenv.config();

// middlewares
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PORT and DB setup
const PORT = process.env.PORT || 3000;
const DB_CONNECTION =
  process.env.NODE_ENV === "production"
    ? process.env.DB_CONNECTION || ""
    : "mongodb://localhost:27017/party-stack";

// check that DB_CONNECTION is not undefined
if (!DB_CONNECTION) {
  throw {
    status: 500,
    message: "DB_CONNECTION is not set",
  };
}

// routes
app.use("/api/user", userRouter);

// error handling
app.use((e: any, req: Request, res: Response, next: NextFunction) => {
  if (e.status >= 400 && e.status <= 499) {
    res.status(e.status).json({ message: e.message });
  } else {
    console.error(e);
    res
      .status(500)
      .json({ message: "An error occured, please try again later" });
  }
});

async function start() {
  await mongoose.connect(DB_CONNECTION);
  console.log("Connected to the database:", DB_CONNECTION);

  // listen for incoming requests
  app.listen(PORT, () => {
    console.log(`Express server running on PORT: ${PORT}`);
  });
}

start();
