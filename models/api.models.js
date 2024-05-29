const fs = require("fs/promises");
const connection = require("../db/connection");

exports.readEndpoints = () => {
  return fs.readFile("./endpoints.json", "utf-8");
};
