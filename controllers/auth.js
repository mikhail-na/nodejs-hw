const User = require("../models/authUser");
const { HttpError } = require("../helpers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const Jimp = require("jimp");

const BCRYPT_SALT = 10;
const { SECRET_KEY = "g676g78g8gG8g8gY8" } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");


const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email is already registered");
    }

    const avatarURL = gravatar.url(email);

    const salt = await bcrypt.genSalt(BCRYPT_SALT);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL
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


const updAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const uniqueName = `${_id}_${originalname}`

  try {

    const resultJimp = await Jimp.read(tempUpload);
    await resultJimp.resize(250, 250).writeAsync(tempUpload);


    const resultUpload = path.join(avatarsDir, uniqueName);
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("public", "avatars", uniqueName);
    await User.findByIdAndUpdate(_id, { avatarURL })

    res.json({
      avatarURL
    })
  } catch (err) {
    await fs.unlink(tempUpload);
    next(err);
  }
}

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updAvatar,
};
