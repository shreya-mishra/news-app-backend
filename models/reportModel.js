import mongoose from "mongoose";

const reportSchema = mongoose.Schema(
  {
    news: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "News",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
