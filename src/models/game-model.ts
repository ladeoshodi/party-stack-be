import mongoose from "mongoose";

const { Schema } = mongoose;

const gameSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "A game title is required"],
    },
    imageUrl: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "The game creator is required"],
    },
    description: {
      type: String,
      required: [true, "A game description is required"],
    },
    gameSetup: {
      type: String,
      required: [true, "Please provide a description on how to setup the game"],
    },
    howToPlay: {
      type: String,
      required: [true, "Please provide a description on how to play the game"],
    },
    rating: {
      type: Number,
      enum: {
        values: [0, 1, 2, 3, 4, 5],
        message: "Rating must either be 0 (unrated) or a value between 1 - 5",
      },
      default: 0,
    },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

async function initialiseDBIndex() {
  await Game.init();
}

initialiseDBIndex();

export { Game };
