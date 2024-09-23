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

  test("Should get a single game", async () => {
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

describe("Testing POST Game", () => {
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
        title: "Test Game via Jest",
        imageUrl: "https://testimageurl.com",
        creator: testUser,
        description: "This is a description for Test Game 1",
        gameSetup: "This is how you setup Test Game 1",
        howToPlay: "This is how you play Test Game 1",
        rating: 3,
      });
    expect(gamesRes.status).toBe(StatusCodes.CREATED);
    expect(gamesRes.body.title).toBe("Test Game via Jest");
  });

  test("Should not create a new game with missing fields", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // create a user
    const testUser = await User.find({ email: "testuser1@example.com" });

    // try to create a new game
    const gamesRes = await api
      .post("/api/games")
      .set("Authorization", token)
      .send({
        title: "Test Game via Jest",
      });

    // Game should not be created
    const gameNotFound = await Game.findOne({ title: "Test Game via Jest" });

    expect(gamesRes.status).toBe(StatusCodes.BAD_REQUEST);
    expect(gameNotFound).toBeNull();
  });
});

describe("Testing UPDATE Game", () => {
  test("Should update a game", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a game
    const game = await Game.findOne({ title: "Test Game 1" });

    // update game
    const gamesRes = await api
      .put(`/api/games/${game?._id}`)
      .set("Authorization", token)
      .send({
        title: "Updated Game Title via Jest",
      });
    expect(gamesRes.status).toBe(StatusCodes.OK);
    expect(gamesRes.body.title).toBe("Updated Game Title via Jest");
  });

  test("Should not update a game belonging to a different user", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a game by a different user
    const game = await Game.findOne({ title: "Test Game 2" });

    // try to update game
    const gamesRes = await api
      .put(`/api/games/${game?._id}`)
      .set("Authorization", token)
      .send({
        title: "Title should not be updated",
      });

    // Game should not be update
    const gameNotFound = await Game.findOne({
      title: "Title should not be updated",
    });

    expect(gamesRes.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(gameNotFound).toBeNull();
  });

  test("Should not update game creator field", async () => {
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

    // get a game
    const game = await Game.findOne({ title: "Test Game 1" });

    // update game
    const gamesRes = await api
      .put(`/api/games/${game?._id}`)
      .set("Authorization", token)
      .send({
        creator: differentUser,
      });
    expect(gamesRes.status).toBe(StatusCodes.BAD_REQUEST);
    expect(gamesRes.body.creator).not.toBe(differentUser?._id.toString());
  });
});

describe("Testing DELETE Game", () => {
  test("Should delete a game", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a game
    const game = await Game.findOne({ title: "Test Game 1" });

    // delete game
    const gamesRes = await api
      .delete(`/api/games/${game?._id}`)
      .set("Authorization", token);
    expect(gamesRes.status).toBe(StatusCodes.NO_CONTENT);
  });

  test("Should not delete a game belonging to a different user", async () => {
    // get a token
    const tokenRes = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    const token = tokenRes.body.token;

    // get a game by a different user
    const game = await Game.findOne({ title: "Test Game 2" });

    // try to update game
    const gamesRes = await api
      .put(`/api/games/${game?._id}`)
      .set("Authorization", token);

    // Game should not be deleted
    const gameNotDeleted = await Game.findById(game);

    expect(gamesRes.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(gameNotDeleted).not.toBeNull();
  });
});
