import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import swaggerOutput from "./swagger-output.json";
import swaggerUi from "swagger-ui-express";
import { routes } from "./routes";
import { MONGODB_URI, PORT } from "./config/environment";

// middlewares
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use("/api", routes);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerOutput, {
    swaggerOptions: {
      url: "/api-docs/swagger-output.json",
    },
  })
);

// error handling
app.use((e: any, req: Request, res: Response, next: NextFunction) => {
  if (e.status >= 400 && e.status <= 499) {
    res.status(e.status).json({ message: e.message });
  } else {
    console.error(e);
    res
      .status(500)
      .json({ message: "An error occurred, please try again later" });
  }
});

async function start() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to the database:", MONGODB_URI);

  // listen for incoming requests
  // return the http object to close it after testing
  return app.listen(PORT, () => {
    console.log(`Express server running on PORT: ${PORT}`);
  });
}

const serverStartPromise = start();

export { serverStartPromise, app };
