import mongoose from "mongoose";

const bookmarkSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    newsList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "News",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
