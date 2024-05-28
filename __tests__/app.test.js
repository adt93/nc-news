const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("api/topics", () => {
  test("GET: 200 - get request should respond with status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("GET: 200 - returns an object with all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
      });
  });
});

describe("non existent path", () => {
  test("GET: 404 - should return an error message when the path is not found", () => {
    return request(app)
      .get("/api/tropics")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Path not found" });
      });
  });
});
