const { getArticleById } = require("../models/articles.models");

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
