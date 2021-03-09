import mongoose from "mongoose";

const magazineSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    pics: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Magazine = mongoose.model("Magazine", magazineSchema);

export default Magazine;
