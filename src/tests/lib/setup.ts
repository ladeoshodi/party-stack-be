import mongoose from "mongoose";
import { User } from "../../models/user-model";
import { Game } from "../../models/game-model";
import { Comment } from "../../models/comment-model";
import { MONGODB_URI } from "../../config/environment";

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
      title: "Test Game 1",
      imageUrl: "https://images.unsplash.com/photo-1522069213448-443a614da9b6",
      creator: users[0],
      description: "This is a description for game 1",
      gameSetup: "This is the setup for game 1",
      howToPlay: "This is how to play game 1",
      rating: 3,
    },
    {
      title: "Test Game 2",
      imageUrl: "https://images.unsplash.com/photo-1642056446796-8c7d1dcb630b",
      creator: users[1],
      description: "This is a description for game 2",
      gameSetup: "This is the setup for game 2",
      howToPlay: "This is how to play game 2",
      rating: 4,
    },
  ];
}

const userData = [
  {
    username: "testuser1",
    email: "testuser1@example.com",
    password: "#T3stus3r",
  },
  {
    username: "testuser2",
    email: "testuser2@example.com",
    password: "#T3stus3r",
  },
];

async function setup() {
  await mongoose.connect(MONGODB_URI);
  const users = await User.create(userData);
  const gameData = getGameData(users);
  const games = await Game.create(gameData);
  const commentData = getCommentData(users, games);
  await Comment.create(commentData);
}

export default setup;
