const mongoose = require("mongoose");

const surveySchema9 = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    district: {
      type: String,
      required: [true, "Please select a District"],
      trim: true,
    },
    constituencyName: {
      type: String,
      required: [true, "Please select a Constituency"],
      trim: true,
    },
    constituencyNumber: {
      type: String,
      required: [true, "Please select a Constituency"],
      trim: true,
    },
    Booth: {
      type: String,
      required: [true, "Please select a Booth"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please select an Address"],
      trim: true,
    },
    administrativeIssues: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Survey9 = mongoose.model("Survey9", surveySchema9);

module.exports = Survey9;
