import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
			unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    userProfilePic: {
      type: String,
      default: "",
    },
    followers: {
			type: [String],
			default: [],
		},
    following: {
			type: [String],
			default: [],
		},
    bio: {
      type: String,
      default: "",
    },
    isFrooren:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

