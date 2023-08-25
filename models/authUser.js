const { Schema, model } = require("mongoose");

const { handleMongooseErr } = require('../helpers');

const emailRegexp = /^[\w-/.]+@([\w-]+\.)+[\w-]{2,4}$/;


const userSchema = new Schema(
  {
    name: {
      type: String,
      default: "Guest",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default:"",
    },
    avatarURL: {
      type: String,
      required: true,
    }
  },
  {
    versionKey: false,
    timeseries: true,
  }
);

userSchema.post("save", handleMongooseErr);


const User = model("user", userSchema);

module.exports = User;