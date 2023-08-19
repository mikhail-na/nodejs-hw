const User = require("../models/authUser");
const { HttpError } = require("../helpers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BCRYPT_SALT = 10;
const { SECRET_KEY = "g676g78g8gG8g8gY8" } = process.env;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email is already registered");
    }

    const salt = await bcrypt.genSalt(BCRYPT_SALT);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Invalid email address or password");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Invalid email address or password");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndDelete(_id, { token: "" });

  res.status(204);
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
};
