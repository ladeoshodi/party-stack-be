import dotenv from "dotenv";
dotenv.config();

function getMongoURI(): string {
  if (process.env.NODE_ENV === "test") {
    return process.env.MONGODB_URI_TEST as string;
  } else if (process.env.NODE_ENV === "development") {
    return process.env.MONGODB_URI_DEV as string;
  }
  return process.env.MONGODB_URI_PROD as string;
}

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET as string;
const MONGODB_URI = getMongoURI();

export { JWT_SECRET, MONGODB_URI, PORT };
