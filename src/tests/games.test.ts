import supertest from "supertest";
import setup from "./lib/setup";
import { afterEachTearDown, afterAllTearDown } from "./lib/tearDown";
import { app } from "../main";
import { StatusCodes } from "http-status-codes";
import { Game } from "../models/game-model";

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
});
