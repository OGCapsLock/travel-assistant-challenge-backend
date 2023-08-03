import { describe, it } from "@jest/globals";
import { newUser } from ".";

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
    const notFound = await fetchUser(user);
    expect(notFound).toBeTruthy();
  });
});
