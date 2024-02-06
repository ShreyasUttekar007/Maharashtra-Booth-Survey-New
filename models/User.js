const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    roles: {
      type: [
        {
          type: String,
          enum: [
            "admin",
            "mod",
            "user",
            "1-Nandurbar (ST)",
            "2-Dhule",
            "3-Jalgaon",
            "4-Raver",
            "5-Buldhana",
            "6-Akola",
            "7-Amravati (SC)",
            "8-Wardha",
            "9-Ramtek (SC)",
            "10-Nagpur",
            "11-Bhandara-Gondiya",
            "12-Gadchiroli-Chimur (ST)",
            "13-Chandrapur",
            "14-Yavatmal-Washim",
            "15-Hingoli",
            "16-Nanded",
            "17-Parbhani",
            "18-Jalna",
            "19-Chatrapati Sambhaji Nagar",
            "20-Dindori (ST)",
            "21-Nashik",
            "22-Palghar (ST)",
            "23-Bhiwandi",
            "24-Kalyan",
            "25-Thane",
            "26-Mumbai North",
            "27-Mumbai North-West",
            "28-Mumbai North-East",
            "29-Mumbai North-Central",
            "30-Mumbai South-Central",
            "Sindhudurg",
            "32-Raigad",
            "33-Maval",
            "34-Pune",
            "35-Baramati",
            "36-Shirur",
            "37-Ahmednagar",
            "38-Shirdi (SC)",
            "37-Ahmednagar",
            "40-Dharashiv",
            "41-Latur (SC)",
            "42-Solapur (SC)",
            "43-Madha",
            "44-Sangli",
            "45-Satara",
            "46-Ratnagiri-Sindhudurg",
            "47-Kolhapur",
            "48-Hatkanangle",
          ],
        },
      ],
      default: ["user"],
    },
  },
  { timestamps: true }
);
UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});
UserSchema.methods.comparePassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return next(err);
    next(null, isMatch);
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
