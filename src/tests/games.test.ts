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

describe("Testing Games", () => {
  test("Should get all games", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    const gamesRes = await api.get("/api/games").set("Authorization", token);
    expect(gamesRes.status).toBe(StatusCodes.OK);
    expect(gamesRes.body.length).toBeTruthy();
  });
  test("Should get a single games", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // query games
    const games = await Game.find({});

    const gamesRes = await api
      .get(`/api/games/${games[0]._id}`)
      .set("Authorization", token);
    expect(gamesRes.status).toBe(StatusCodes.OK);
    expect(gamesRes.body._id).toBe(games[0]._id.toString());
  });

  test("Should create a new game", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // create a user
    const testUser = await User.find({ email: "testuser1@example.com" });

    // create a new game
    const gamesRes = await api
      .post("/api/games")
      .set("Authorization", token)
      .send({
        title: "Test Game 1",
        imageUrl: "https://testimageurl.com",
        creator: testUser,
        description: "This is a description for Test Game 1",
        gameSetup: "This is how you setup Test Game 1",
        howToPlay: "This is how you play Test Game 1",
        rating: 3,
      });
    expect(gamesRes.status).toBe(StatusCodes.CREATED);
    expect(gamesRes.body.title).toBe("Test Game 1");
  });
});
