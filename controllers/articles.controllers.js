const {
  getArticleById,
  SelectAllArticles,
} = require("../models/articles.models");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  if (article_id) {
    getArticleById(article_id)
      .then((article) => {
        response.status(200).send({ article });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  SelectAllArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
