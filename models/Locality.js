const mongoose = require("mongoose");

const urbanSchema = new mongoose.Schema(
  {
    nagarPanchayat: {
      type: String,
      trim: true,
    },
    wardNo: {
      type: String,
      trim: true,
    },
    wardName: {
      type: String,
      trim: true,
    },
    corporatorName: {
      type: String,
      trim: true,
    },
    corporatorContact: {
      type: String,
      trim: true,
    },
    runnerUpCorporator: {
      type: String,
      trim: true,
    },
    runnerUpCorporatorContact: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ruralSchema = new mongoose.Schema(
  {
    taluka: {
      type: String,
      trim: true,
    },
    zilaParishadGatt: {
      type: String,
      trim: true,
    },
    panchayatSamitiGann: {
      type: String,
      trim: true,
    },
    village: {
      type: String,
      trim: true,
    },
    sarpanch: {
      type: String,
      trim: true,
    },
    sarpanchContact: {
      type: String,
      trim: true,
    },
    runnerUpSarpanch: {
      type: String,
      trim: true,
    },
    runnerUpSarpanchContact: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const surveySchema = new mongoose.Schema(
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
    locality: {
      type: String,
      required: [true, "Please select a Locality"],
      trim: true,
    },

    urbanData: urbanSchema,
    ruralData: ruralSchema,
  },
  { timestamps: true }
);

const UrbanSurvey = mongoose.model("UrbanSurvey", surveySchema);
const RuralSurvey = mongoose.model("RuralSurvey", surveySchema);

module.exports = { UrbanSurvey, RuralSurvey };
