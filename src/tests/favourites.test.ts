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

describe("Testing Adding and Removing from favourites", () => {
  test("Should add to current user favourites", async () => {
    // get a token
    const res = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = res.body.token;

    // get a game
    const game = await Game.findOne({ title: "Test Game 1" });

    // add to favourites of current logged in user
    const favUpdateRes = await api
      .post("/api/favourites")
      .set("Authorization", token)
      .send({
        favourites: game,
      });
    expect(favUpdateRes.status).toBe(StatusCodes.OK);
    expect(favUpdateRes.body.favourites.length).toBeTruthy();
    expect(favUpdateRes.body.favourites[0]._id).toBe(game?._id.toString());
  });

  test("Should remove from current user favourites", async () => {
    // get a token
    const res = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = res.body.token;

    // get some games
    const game1 = await Game.findOne({ title: "Test Game 1" });
    const game2 = await Game.findOne({ title: "Test Game 2" });

    // add games to favourites
    await User.updateOne(
      { username: "testuser1" },
      { $push: { favourites: [game1, game2] } }
    );

    // remove from favourites of current logged in user
    const favDeleteRes = await api
      .delete(`/api/favourites/${game1?._id}`)
      .set("Authorization", token);

    // get current user favs
    const currentUserFavs = (
      await User.findOne({ email: "testuser1@example.com" })
    )?.favourites;
    expect(favDeleteRes.status).toBe(StatusCodes.NO_CONTENT);
    expect(currentUserFavs?.length).toBe(1);
  });
});
