const jwt = require("jsonwebtoken");

const { HttpError } = require("../helpers");
const User = require('../models/authUser');

const { SECRET_KEY = "g676g78g8gG8g8gY8" } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401, "The type of bearer token is not valid"));
  }

  if (!token) {
    next(HttpError(401, "No token provided"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user) {
      // 2d var ==> if (!user || !user.token || user.token!==token)
      next(HttpError(401));
    }
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(HttpError(401, "Token expired")) ;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      next(HttpError(401, "Token is not valid"));
    }
  
  }
}

module.exports = authenticate;
