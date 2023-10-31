const jwt = require("jsonwebtoken");
require('dotenv').config();

const _TOKEN = process.env._ACCESS_TOKEN
export const verifyToken = (req, res, next) => {
  const token = req.cookies._TOKEN;

  if (!token) {
    return res.status(403).send({ error: "A token is required for authentication" });
  }
  try {
    return next();
  } catch (err) {
    return res.status(401).send({ error: "Invalid Token" });
  }

};

export default verifyToken;
