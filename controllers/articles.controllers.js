const {
  getArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  postComment,
  checkUserExists,
  updateArticleById,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (article_id) {
    getArticleById(article_id)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => {
        next(err);
      });
  }
};
exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectAllArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  Promise.all([
    checkUserExists(username),
    postComment(article_id, username, body),
  ])
    .then((result) => {
      res.status(201).send({ result: result[1] });
    })
    .catch(next);
};
exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  getArticleById(article_id).then(() => {
    updateArticleById(article_id, inc_votes)
      .then((article) => {
        res.status(200).send({ article });
      })
  })
    .catch(next);
};
