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
exports.postComment = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Missing Required Fields",
    });
  }
  return db
    .query(
      `INSERT INTO comments (article_id, author, body, votes)
      VALUES ($1, $2, $3, DEFAULT)
      RETURNING *`,
      [article_id, username, body]
    )
    .then((res) => {
      return res.rows[0];
    });
};
exports.checkUserExists = (username) => {
  return db
    .query("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)", [username])
    .then((result) => {
      return result.rows[0].exists;
    });
};
exports.updateArticleById = (article_id, body) => {
  return db
    .query(
      `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *
  `,
      [body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
exports.removeCommentById = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id =$1 RETURNING body`, [
      commentId,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment Not Found" });
      }
      return rows;
    });
};
