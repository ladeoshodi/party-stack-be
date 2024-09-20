import mongoose from "mongoose";
import { User } from "../models/user-model";
import { Game } from "../models/game-model";
import { Comment } from "../models/comment-model";
import { MONGODB_URI } from "../config/environment";

function getCommentData(users: any[], games: any[]) {
  return [
    {
      text: "This is the first comment for game 1",
      author: users[0],
      game: games[0],
    },
    {
      text: "This is the second comment for game 1",
      author: users[1],
      game: games[0],
    },
    {
      text: "This is the first comment for game 2",
      author: users[0],
      game: games[1],
    },
  ];
}

function getGameData(users: any[]) {
  return [
    {
      title: "Game 1",
      imageUrl: "https://images.unsplash.com/photo-1522069213448-443a614da9b6",
      creator: users[0],
      description: "This is a description for game 1",
      gameSetup: "This is the setup for game 1",
      howToPlay: "This is how to play game 1",
      rating: 3,
    },
    {
      title: "Game 2",
      imageUrl: "https://images.unsplash.com/photo-1642056446796-8c7d1dcb630b",
      creator: users[1],
      description: "This is a description for game 2",
      gameSetup: "This is the setup for game 2",
      howToPlay: "This is how to play game 2",
      rating: 4,
    },
  ];
}

// user data
const userData = [
  {
    username: "seeduser1",
    email: "seeduser@example.com",
    password: "#S33dus3r",
  },
  {
    username: "seeduser2",
    email: "seeduser2@example.com",
    password: "#S33dus3r",
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to the database! 🔥");

  // delete all existing data
  console.log("Wiping database clean");
  await User.deleteMany({});
  await Game.deleteMany({});
  await Comment.deleteMany({});

  console.log("Creating users in the db");
  const users = await User.create(userData);

  console.log("Creating games in the db");
  const gameData = getGameData(users);
  const games = await Game.create(gameData);

  console.log("Creating comments in the db");
  const commentData = getCommentData(users, games);
  await Comment.create(commentData);

  console.log("Giving a user a favourite game");
  await User.findByIdAndUpdate(users[0], { $push: { favourites: games[0] } });

  await mongoose.disconnect();
  console.log("Disconnected from the database... bye bye");
}

seed();
