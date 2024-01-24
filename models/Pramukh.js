const mongoose = require("mongoose");
const { Schema } = mongoose

const surveySchema2 = new Schema(
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
    pramukhName: {
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
  { timestamps: true }
);

const Survey2 = mongoose.model("Survey2", surveySchema2);

module.exports = Survey2;
