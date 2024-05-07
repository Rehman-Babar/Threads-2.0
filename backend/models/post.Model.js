import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type:[mongoose.Schema.Types.ObjectId],
      ref : 'User',
      default:[]
    },
    text: {
      type: String,
      maxLenghth: 500,
    },
    img: {
      type: String,
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
					required: true
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        userName:{
          type:String
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
