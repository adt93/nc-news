const connection = require("../db/connection");

exports.getArticleById = (article_id) => {
  return connection
    .query(
      `SELECT articles.*,
       COUNT(comments.article_id) AS comment_count 
       FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id 
       WHERE articles.article_id = $1
       GROUP BY articles.article_id
      `,
      [article_id]
    )
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found.",
        });
      } else return article[0];
    });
};
