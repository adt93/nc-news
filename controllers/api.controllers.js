const { readEndpoints } = require("../models/api.models");

exports.getEndpoints = (req, res, next) => {
  return readEndpoints().then((endpoints) => {
    res.status(200).send(JSON.parse(endpoints));
  });
};
