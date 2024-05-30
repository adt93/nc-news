const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");
const {
  getArticleById,
  getAllArticles,
} = require("./controllers/articles.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path Not Found" });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
