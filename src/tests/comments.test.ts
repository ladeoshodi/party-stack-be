import supertest from "supertest";
import setup from "./lib/setup";
import { afterEachTearDown, afterAllTearDown } from "./lib/tearDown";
import { app } from "../main";
import { StatusCodes } from "http-status-codes";
import { Game } from "../models/game-model";
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

describe("Testing GET Game", () => {
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

  //   test("Should get a single game", async () => {
  //     // get a token
  //     const tokenRes = await api.post("/api/user/login").send({
  //       email: "testuser1@example.com",
  //       password: "#T3stus3r",
  //     });
  //     const token = tokenRes.body.token;

  //     // query games
  //     const games = await Game.find({});

  //     const gamesRes = await api
  //       .get(`/api/games/${games[0]._id}`)
  //       .set("Authorization", token);
  //     expect(gamesRes.status).toBe(StatusCodes.OK);
  //     expect(gamesRes.body._id).toBe(games[0]._id.toString());
  //   });
});
