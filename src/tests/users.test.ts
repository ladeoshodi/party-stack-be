import supertest from "supertest";
import setup from "./lib/setup";
import { afterEachTearDown, afterAllTearDown } from "./lib/tearDown";
import { app } from "../main";
import { StatusCodes } from "http-status-codes";

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

describe("Testing Registration and Login", () => {
  test("Should register a new user", async () => {
    const res = await api.post("/api/user/register").send({
      username: "fakeuser",
      email: "fakeuser@example.com",
      password: "#Fak3user",
      passwordConfirmation: "#Fak3user",
    });
    expect(res.status).toBe(StatusCodes.CREATED);
  });
  test("Should not register an existing user", async () => {
    const res = await api.post("/api/user/register").send({
      username: "testuser1",
      email: "testuser1@example.com",
      password: "#T3stus3r",
      passwordConfirmation: "#T3stus3r",
    });
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("Should be able to login an existing user", async () => {
    const res = await api.post("/api/user/login").send({
      email: "testuser1@example.com",
      password: "#T3stus3r",
    });
    expect(res.status).toBe(StatusCodes.OK);
    expect(typeof res.body.token).toBe("string");
  });
  test("Should not login a non-existent user", async () => {
    const res = await api.post("/api/user/login").send({
      email: "notexistinguser@example.com",
      password: "#T3stus3r",
    });
    expect(res.status).toBe(StatusCodes.NOT_FOUND);
  });
});
