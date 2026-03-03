import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    birthWeight: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Child", childSchema);