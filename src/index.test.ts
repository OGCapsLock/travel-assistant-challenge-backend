import { describe, it } from "@jest/globals";
import request from "supertest";

import app, { fetchUser, newUser } from ".";

describe("Say Hello", () => {
  it("Greats", () => {
    expect("Hello world").toEqual("Hello world");
  });
  it("Creates user", async () => {
    const user = {
      userName: "admin",
      password: "1234",
    };
    const created = await newUser(user);
    expect(created).toBeTruthy();
  });
  it("Fetch user fake user", async () => {
    const user = {
      userName: "admin1",
      password: "1234",
    };
    const found = await fetchUser(user);
    expect(!!found?.id).toBeFalsy();
  });
  it("Fetch user real user", async () => {
    const user = {
      userName: "admin",
      password: "1234",
    };
    const found = await fetchUser(user);
    expect(!!found?.id).toBeTruthy();
  });
});
describe("Test /login", () => {
  it("Valid JWT for real user", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "admin", password: "1234" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
