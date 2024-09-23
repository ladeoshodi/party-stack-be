import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "A written comment is required"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "The comment author is required"],
      immutable: true,
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: [true, "A Game reference is required"],
      immutable: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

async function initialiseDBIndex() {
  await Comment.init();
}

initialiseDBIndex();

export { Comment };
