const db = require("../db/connection");

exports.getArticleById = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
       WHERE article_id = $1;
      `,
      [article_id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article Not Found",
        });
      } else return article.rows[0];
    });
};
exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT
        articles.author,
        articles.title,
        articles.topic,
        articles.article_id,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC`
    )
    .then((res) => {
      return res.rows;
    });
};
exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows;
      } else {
        return Promise.reject({
          status: 400,
          msg: "Bad Request",
        });
      }
    });
};
