const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointsDoc = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  test("GET: 200 - responds with an object describing all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointsDoc);
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("status: 200", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
});
test("status: 200 and responds with an object", () => {
  return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then((response) => {
      const result = response.body;
      expect(typeof result).toBe("object");
    });
});

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
        expect(topics).toHaveLength(3);
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
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
