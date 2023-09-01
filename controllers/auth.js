const User = require("../models/authUser");
const { HttpError, sendEmail, ctrlWrapper } = require("../helpers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const {nanoid} = require("nanoid");

const Jimp = require("jimp");

const BCRYPT_SALT = 10;
const { SECRET_KEY = "g676g78g8gG8g8gY8", BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "User is already in the system!");
    }

    const avatarURL = gravatar.url(email);

    const salt = await bcrypt.genSalt(BCRYPT_SALT);
    const hashPassword = await bcrypt.hash(password, salt);

    const verificationToken = nanoid();

  
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<html><a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify your email</a></html>`,
    };

    await sendEmail(verifyEmail);
    
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL
      },
    });

};

const varifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "User not found!");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
   
    res.json({
      message: "Verification successful!",
    });

};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "User not found!");
    }
    if (user.verify) {
      throw HttpError(401, "Verification has already been passed");
    }
      const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<html><a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify your email</a></html>`,
      };
    
    await sendEmail(verifyEmail);

    res.json({
      message: "Verification email sent",
    });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Invalid email address or password");
    }

    if (!user.verify) {
      throw HttpError(401, "Email is not verified");
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
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
};

const logout = async (req, res) => {
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
};

const updSubscription = async (req, res) => {
  const { _id: id, subscription } = req.user;
  const newSubscription = req.body.subscription;

  if (newSubscription === subscription) {
     throw HttpError(409, "Invalid subscription! Subscription stay the same");
  }

  const subscriptionUpgrade = await User.findByIdAndUpdate(id, { subscription: newSubscription }, { new: true });

  if (!subscriptionUpgrade) {
    throw HttpError(409, "Not Found");
  }
  res.status(200).json({
    message: `${subscriptionUpgrade.subscription} - subscription was successfully upgraded!`,
  });
}
  

module.exports = {
  register: ctrlWrapper(register),
  varifyEmail: ctrlWrapper(varifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updAvatar: ctrlWrapper(updAvatar),
  updSubscription: ctrlWrapper(updSubscription),
};
