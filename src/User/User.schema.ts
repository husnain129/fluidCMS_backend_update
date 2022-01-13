import { model, Schema } from "mongoose";
import validator from "validator";
import { IUser } from "./User.interface";
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    email: {
      type: String,
      required: [true, "Please tell us your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    profile: {
      thumb: {
        url: String,
        cdn_id: String,
      },
      profile_img: {
        url: String,
        cdn_id: String,
      },
    },
    token: String,
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function(this, next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(
  candidataPassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidataPassword, userPassword);
};

export default model<IUser>("User", userSchema);
