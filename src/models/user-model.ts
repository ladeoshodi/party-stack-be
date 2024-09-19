import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "A username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "An email is required"],
      unique: true,
      validate: {
        validator: (email: string) => validator.isEmail(email),
        message: "Invalid Email format",
      },
    },
    password: {
      type: String,
      required: [true, "A password is required"],
      select: false,
      validate: {
        validator: (password: string) =>
          validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        message:
          "Password must be at least 8 characters and have at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
      },
    },
    imageUrl: String,
    favourites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Game",
        set: (v: string) => (v === "" ? null : v),
      },
    ],
  },
  { timestamps: true }
);

// hash passwords before mongoose model saves
userSchema.pre("save", function (next) {
  // hash user password
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());

  next();
});

const User = mongoose.model("User", userSchema);

async function initialiseDBIndex() {
  await User.init();
}

initialiseDBIndex();

export { User };
