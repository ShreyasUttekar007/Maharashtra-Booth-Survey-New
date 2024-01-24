const mongoose = require("mongoose");
const { Schema } = mongoose;

const casteSchema = new Schema(
  {
    casteName: {
      type: String,
      trim: true,
    },
    casteValue: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const surveySchema11 = new Schema(
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
    caste: [casteSchema],
  },
  { timestamps: true }
);

const Survey11 = mongoose.model("Survey11", surveySchema11);

module.exports = Survey11;
