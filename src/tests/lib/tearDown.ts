import mongoose from "mongoose";
import { serverStartPromise } from "../../main";
import { User } from "../../models/user-model";
import { Game } from "../../models/game-model";
import { Comment } from "../../models/comment-model";

// ! Drop the data
async function afterEachTearDown() {
  await User.deleteMany({});
  await Game.deleteMany({});
  await Comment.deleteMany({});
}

// ! disconnect the db, kill express
async function afterAllTearDown() {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();

  const server = await serverStartPromise;
  server.close();
}

export { afterEachTearDown, afterAllTearDown };
