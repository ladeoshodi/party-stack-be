import supertest from "supertest";
import setup from "./lib/setup";
import { afterEachTearDown, afterAllTearDown } from "./lib/tearDown";
import { app } from "../main";
import { StatusCodes } from "http-status-codes";
import { Game } from "../models/game-model";
import { Comment } from "../models/comment-model";
import { User } from "../models/user-model";

const api = supertest(app);

beforeEach(async () => {
  await setup();
});

afterEach(async () => {
  await afterEachTearDown();
});

afterAll(async () => {
  await afterAllTearDown();
});

describe("Testing GET Comment", () => {
  test("Should get all comments", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get all comments
    const commentsRes = await api
      .get("/api/comments")
      .set("Authorization", token);
    expect(commentsRes.status).toBe(StatusCodes.OK);
    expect(commentsRes.body.length).toBeTruthy();
  });

  test("Should get all comments for a game", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a game
    const game = await Game.findOne({ title: "Test Game 1" });

    // get all comments
    const commentsRes = await api
      .get(`/api/comments?game=${game?._id}`)
      .set("Authorization", token);
    expect(commentsRes.status).toBe(StatusCodes.OK);
    expect(commentsRes.body.length).toBeTruthy();
    expect(commentsRes.body[0].game._id).toBe(game?._id.toString());
  });

  test("Should get all comments for a user", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a user
    const user = await User.findOne({ email: "testuser1@example.com" });

    // get all comments
    const commentsRes = await api
      .get("/api/comments?author=true")
      .set("Authorization", token);
    expect(commentsRes.status).toBe(StatusCodes.OK);
    expect(commentsRes.body.length).toBeTruthy();
    expect(commentsRes.body[0].author._id).toBe(user?._id.toString());
  });

  test("Should get all comments for a user for a game", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a game
    const game = await Game.findOne({ title: "Test Game 1" });
    // get a user
    const user = await User.findOne({ email: "testuser1@example.com" });

    // get all comments
    const commentsRes = await api
      .get(`/api/comments?game=${game?._id}&?author=true`)
      .set("Authorization", token);
    expect(commentsRes.status).toBe(StatusCodes.OK);
    expect(commentsRes.body.length).toBeTruthy();
    expect(commentsRes.body[0].game._id).toBe(game?._id.toString());
    expect(commentsRes.body[0].author.username).toBe(user?.username);
  });

  test("Should get a single comment", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // query games
    const comments = await Comment.find({});

    // get a single comment
    const commentRes = await api
      .get(`/api/comments/${comments[0]._id}`)
      .set("Authorization", token);
    expect(commentRes.status).toBe(StatusCodes.OK);
    expect(commentRes.body._id).toBe(comments[0]._id.toString());
  });
});

describe("Testing POST Comment", () => {
  test("Should create a new comment", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a game
    const games = await Game.find({});

    // create a new comment
    const commentRes = await api
      .post("/api/comments")
      .set("Authorization", token)
      .send({
        text: "This is a new text comment",
        game: `${games[0]._id}`,
      });
    expect(commentRes.status).toBe(StatusCodes.CREATED);
    expect(commentRes.body.text).toBe("This is a new text comment");
  });

  test("Should not create a new comment with missing fields", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // try to create a new comment
    const commentRes = await api
      .post("/api/comments")
      .set("Authorization", token)
      .send({
        text: "This is a new text comment",
      });

    // Comment should not be created
    const commentNotFound = await Comment.findOne({
      title: "This is a new text comment",
    });

    expect(commentRes.status).toBe(StatusCodes.BAD_REQUEST);
    expect(commentNotFound).toBeNull();
  });
});

describe("Testing UPDATE Comment", () => {
  test("Should update a comment", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a comment
    const comment = await Comment.findOne({
      text: "This is the first comment for game 1",
    });

    // update comment
    const commentRes = await api
      .put(`/api/comments/${comment?._id}`)
      .set("Authorization", token)
      .send({
        text: "This is an updated comment",
      });

    expect(commentRes.status).toBe(StatusCodes.OK);
    expect(commentRes.body.text).toBe("This is an updated comment");
  });

  test("Should not update a comment belonging to a different user", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a different user
    const user = await User.findOne({ email: "testuser2@example.com" });

    // get a comment by a different user
    const comment = await Comment.findOne({ author: user });

    // try to update a comment
    const commentRes = await api
      .put(`/api/comments/${comment?._id}`)
      .set("Authorization", token)
      .send({
        text: "Comment should not be updated",
      });

    // comment should not be update
    const commentNotFound = await Comment.findOne({
      text: "Comment should not be updated",
    });

    expect(commentRes.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(commentNotFound).toBeNull();
  });

  test("Should not update the author or game fields in the comment", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get another user
    const differentUser = await User.findOne({
      email: "testuser2@example.com",
    });

    // get another game
    const differentGame = await Game.findOne({
      title: "Test Game 2",
    });

    // get a comment
    const comment = await Comment.findOne({
      text: "This is the first comment for game 1",
    });

    // update comment
    const commentRes = await api
      .put(`/api/comments/${comment?._id}`)
      .set("Authorization", token)
      .send({
        author: differentUser,
        game: differentGame,
      });

    expect(commentRes.status).toBe(StatusCodes.BAD_REQUEST);
    expect(commentRes.body.author).not.toBe(differentUser?._id.toString());
    expect(commentRes.body.game).not.toBe(differentGame?._id.toString());
  });
});

describe("Testing DELETE Comment", () => {
  test("Should delete a comment", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a comment
    const comment = await Comment.findOne({
      text: "This is the first comment for game 1",
    });

    // delete comment
    const commentRes = await api
      .delete(`/api/comments/${comment?._id}`)
      .set("Authorization", token);

    expect(commentRes.status).toBe(StatusCodes.NO_CONTENT);
  });

  test("Should not delete a comment belonging to a different user", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a different user
    const user = await User.findOne({ email: "testuser2@example.com" });

    // get a comment by a different user
    const comment = await Comment.findOne({ author: user });

    // try to delete a comment
    const commentRes = await api
      .delete(`/api/comments/${comment?._id}`)
      .set("Authorization", token);

    // comment should not be deleted
    const commentNotDeleted = await Comment.findById(comment);

    expect(commentRes.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(commentNotDeleted).not.toBeNull();
  });
});
