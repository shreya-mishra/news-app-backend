import mongoose from "mongoose";

const tempNewsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    pic: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const TempNews = mongoose.model("TempNews", tempNewsSchema);

export default TempNews;
