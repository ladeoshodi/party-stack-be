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

describe("Testing Adding and Removing from favourites", () => {
  test("Should update current user favourites", async () => {
    // get a token
    const res = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = res.body.token;

    // get a game
    const game = await Game.findOne({ title: "Test Game 1" });

    // update current logged in user
    const currentUser = await api
      .post("/api/favourites")
      .set("Authorization", token)
      .send({
        favourites: game,
      });
    expect(currentUser.status).toBe(StatusCodes.OK);
    expect(currentUser.body.favourites.length).toBeTruthy();
    expect(currentUser.body.favourites[0]).toBe(game?._id.toString());
  });
});
