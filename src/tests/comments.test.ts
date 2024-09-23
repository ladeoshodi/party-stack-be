import supertest from "supertest";
import setup from "./lib/setup";
import { afterEachTearDown, afterAllTearDown } from "./lib/tearDown";
import { app } from "../main";
import { StatusCodes } from "http-status-codes";
import { Game } from "../models/game-model";
import { User } from "../models/user-model";
import { Comment } from "../models/comment-model";

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
    const games = await Game.find({});

    // get all comments
    const commentsRes = await api
      .get(`/api/comments?game=${games[0]._id}`)
      .set("Authorization", token);
    expect(commentsRes.status).toBe(StatusCodes.OK);
    expect(commentsRes.body.length).toBeTruthy();
    expect(commentsRes.body[0].game._id).toBe(games[0]._id.toString());
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
