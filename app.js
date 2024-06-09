const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteCommentById,
} = require("./controllers/articles.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleById);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/users", getUsers);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path Not Found" });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503") {
    if (err.constraint === "comments_author_fkey") {
      res.status(404).send({ msg: "User Not Found" });
    } else {
      res.status(400).send({ msg: "Bad Request" });
    }
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err);
    next(err);
  }
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
