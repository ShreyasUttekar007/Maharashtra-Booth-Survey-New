const mongoose = require("mongoose");
const { Schema } = mongoose;

const influentialLeaderSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    caste: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },
  },
  { _id: false }
);

const surveySchema3 = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
    partyName: {
      type: String,
      required: [true, "Please select a Party Name"],
      trim: true,
    },
    influentialLeaders: [influentialLeaderSchema],
  },
  { timestamps: true }
);

const Survey3 = mongoose.model("Survey3", surveySchema3);

module.exports = Survey3;
