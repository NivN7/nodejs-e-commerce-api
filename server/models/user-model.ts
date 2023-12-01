import mongoose, { Schema } from "mongoose";
import validator from "validator";

interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

const isEmailValid = (value: string): boolean => {
  return validator.isEmail(value);
};

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: isEmailValid,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user" as const,
  },
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
