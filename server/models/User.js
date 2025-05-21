import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    // email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    highScore: { type: Number, default: 0 },
    friends: { type: Array },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
