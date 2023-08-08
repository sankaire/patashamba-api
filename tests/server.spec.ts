import request from "supertest";
import { app } from "../src/app";

describe("Server base api response", () => {
  test("should return an object and status 200", async () => {
    const server = request(app);
    const res = server.get("/api");
    expect((await res).statusCode).toBe(200);
    expect((await res).body).toEqual({ message: "🚀🍧✅" });
  });
});
