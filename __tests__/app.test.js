const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointsDoc = require("../endpoints.json");
const sorted = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  test("GET: 200 responds with an object describing all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointsDoc);
      });
  });
});
describe("/api/articles/1", () => {
  test("GET: 200: should return an article by its id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const article = res.body.article;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: ERROR responds with the error if the data type for id is incorrect", () => {
    return request(app)
      .get("/api/articles/nonsense")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("404: ERROR responds with the Bad Request", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article Not Found");
      });
  });
});
describe("/api/articles", () => {
  test("GET: 200 should respond with an articles array of article objects, each of which should have the relevant properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
});
describe("api/topics", () => {
  test("GET: 200 get request should respond with status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("GET: 200 returns an object with all topics", () => {
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
describe("responds with error for a non existent path", () => {
  test("404 should return an error message when the path is not found", () => {
    return request(app)
      .get("/api/tropics")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Path Not Found" });
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 /api/articles/:article_id/comments should respond with an array of comments for the given article_id, each of which should have the relevant properties", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(2);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3,
          });
        });
      });
  });
});
test("200: articles should be sorted by created_at in descending order by default", () => {
  return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.comments).toBeSortedBy("created_at", {
        descending: true,
      });
    });
});
test("404: will respond with a 404 when the path is not found", () => {
  return request(app)
    .get("/api/articles/1/cromments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Path Not Found");
    });
});
test("400: will respond with a 400 when the article_id is invalid", () => {
  return request(app)
    .get("/api/articles/99999/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});
describe("/api/articles/:article_id/comments", () => {
  test("POST 201: accepts a request of an object with username and body property, and responds with the posted comment object", () => {
    const requestBody = {
      username: "lurker",
      body: "I am sure, and don't call me Shirley.",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        expect(body.result).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "lurker",
          body: "I am sure, and don't call me Shirley.",
          article_id: 5,
        });
      });
  });
  test("POST 404: When a username is not found respond with a 404", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        username: "adt93",
        body: "I am sure, and don't call me Shirley.",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "User Not Found" });
      });
  });
});

test("POST 400: responds with a 400 status code and error message if user inputs an invalid article ID", () => {
  const requestBody = {
    username: "lurker",
    body: "I am sure, and don't call me Shirley.",
  };
  return request(app)
    .post("/api/articles/orange/comments")
    .send(requestBody)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});
test("POST 400: responds with a 400 status code and error message if user inputs a valid article number but missing post body properties", () => {
  const requestBody = {};
  return request(app)
    .post("/api/articles/5/comments")
    .send(requestBody)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Missing Required Fields");
    });
});
describe("/api/articles/:article_id", () => {
  test("PATCH: 200 should increment a comment vote by input given and respond with the updated comment", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send(newVote)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
});
test("PATCH: will respond with a 400 when the article_id is invalid", () => {
  const newVote = { inc_votes: 1 };

  return request(app)
    .patch("/api/articles/99999")
    .send(newVote)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article Not Found");
    });
});
test("PATCH: responds with a 400 status code and error message if user inputs an invalid article ID ", () => {
  const newVote = { inc_votes: 1 };

  return request(app)
    .patch("/api/articles/banana")
    .send(newVote)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE 204: will return correct error message and no body when given valid comment id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
});
test("DELETE 400: will return correct error message if given invalid comment id", () => {
  return request(app)
    .delete("/api/comments/orange")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});
test("DELETE 404: will return correct error message if given invalid comment id", () => {
  return request(app)
    .delete("/api/comments/9999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Comment Not Found");
    });
});
describe("api/users", () => {
  test("GET: 200 get request should respond with status 200", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("GET: 200 returns an object with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
