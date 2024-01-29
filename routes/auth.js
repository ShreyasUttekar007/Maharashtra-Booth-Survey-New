const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");
const Survey = require("../models/BoothData");
const Survey2 = require("../models/Pramukh");
const Survey3 = require("../models/InfluentialLeaders");
const Survey4 = require("../models/InfluentialPerson");
const Survey5 = require("../models/ProbableJoinee");
const Survey6 = require("../models/LeaderDisgruntled");
const Survey7 = require("../models/CurrentMla");
const Survey8 = require("../models/ShivsenaWinOrLoss");
const Survey9 = require("../models/AdministrativeIssues");
const Survey10 = require("../models/SuggestionOrComplaints");
const Survey11 = require("../models/CasteComposition");
const { UrbanSurvey, RuralSurvey } = require("../models/Locality");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, roles } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const user = new User({ email, password, roles });
    await user.save();
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "1d",
    });
    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    user.comparePassword(password, async function (err, isMatch) {
      if (err) {
        throw err;
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const tokenPayload = {
        userId: user._id,
        roles: user.roles || [],
      };

      const token = jwt.sign(tokenPayload, config.jwtSecret, {
        expiresIn: "1d",
      });

      const userObj = {
        email: user.email,
        _id: user._id,
        roles: user.roles,
      };

      req.session.token = token;

      res.cookie("token", token, {
        maxAge: 36000000,
        sameSite: "none",
        secure: true,
        httpOnly: false,
      });

      res.status(200).json({ message: "Login success", userObj, token });
    });
  } catch (error) {
    next(error);
  }
});


function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token not provided" });
  }

  jwt.verify(token.replace("Bearer ", ""), config.jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.user = {
      userId: decodedToken.userId,
      roles: decodedToken.roles,  
    };
    next();
  });
}



router.post("/urban-survey", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const urbanSurveyData = { ...req.body, userId: userId };

    const urbanSurvey = new UrbanSurvey({
      ...urbanSurveyData,
      urbanData: { ...req.body.urbanData },
      ruralData: undefined,
    });

    const savedUrbanSurvey = await urbanSurvey.save();

    res.status(201).json({
      message: "Urban Survey saved successfully",
      survey: savedUrbanSurvey,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/rural-survey", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const ruralSurveyData = { ...req.body, userId: userId };

    const ruralSurvey = new RuralSurvey({
      ...ruralSurveyData,
      urbanData: undefined,
      ruralData: { ...req.body.ruralData },
    });

    const savedRuralSurvey = await ruralSurvey.save();

    res.status(201).json({
      message: "Rural Survey saved successfully",
      survey: savedRuralSurvey,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/urban-survey/count", authenticateToken, async (req, res, next) => {
  try {
    const totalUrbanSurveys = await UrbanSurvey.countDocuments();

    res.status(200).json({
      message: "Total Urban Surveys",
      count: totalUrbanSurveys,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/rural-survey/count", authenticateToken, async (req, res, next) => {
  try {
    const totalRuralSurveys = await RuralSurvey.countDocuments();

    res.status(200).json({
      message: "Total Rural Surveys",
      count: totalRuralSurveys,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/urban-and-rural-survey/total-count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const totalUrbanSurveys = await UrbanSurvey.countDocuments();
      const totalRuralSurveys = await RuralSurvey.countDocuments();

      const totalSurveys = totalUrbanSurveys + totalRuralSurveys;

      res.status(200).json({
        message: "Total Urban & Rural Surveys Count",
        count: totalSurveys,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/survey", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    let SurveyModel;
    let survey;

    if (req.body.isUrban) {
      SurveyModel = UrbanSurvey;
      survey = new SurveyModel({
        ...surveyData,
        urbanData: { ...surveyData },
        ruralData: undefined,
      });
    } else {
      SurveyModel = RuralSurvey;
      survey = new SurveyModel({
        ...surveyData,
        urbanData: undefined,
        ruralData: { ...surveyData },
      });
    }

    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get("/get-survey", authenticateToken, async (req, res, next) => {
  try {
    const urbanSurveyData = await UrbanSurvey.find();
    const ruralSurveyData = await RuralSurvey.find();

    const surveyData = urbanSurveyData.concat(ruralSurveyData);

    res.status(200).json({ surveys: surveyData });
  } catch (error) {
    next(error);
  }
});

router.get("/get-survey-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const urbanSurveyData = await UrbanSurvey.find({ Booth: req.params.booth });
      const ruralSurveyData = await RuralSurvey.find({ Booth: req.params.booth });

      const surveyData = urbanSurveyData.concat(ruralSurveyData);

      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const urbanSurveyData = await UrbanSurvey.find({ Booth: req.params.booth, district: userRoles[0] });
      const ruralSurveyData = await RuralSurvey.find({ Booth: req.params.booth, district: userRoles[0] });

      const surveyData = urbanSurveyData.concat(ruralSurveyData);

      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const booth = req.params.booth;
      const districtData = [];

      for (const district of userRoles) {
        const urbanSurveyData = await UrbanSurvey.find({ Booth: booth, district: district });
        const ruralSurveyData = await RuralSurvey.find({ Booth: booth, district: district });

        const surveyData = urbanSurveyData.concat(ruralSurveyData);

        districtData.push({ district, surveys: surveyData });
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});



router.get("/get-survey/:userId", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const urbanSurveyData = await UrbanSurvey.find({ userId: userId });
    const ruralSurveyData = await RuralSurvey.find({ userId: userId });

    const surveyData = urbanSurveyData.concat(ruralSurveyData);

    res.status(200).json({ surveys: surveyData });
  } catch (error) {
    next(error);
  }
});

router.post("/create-survey", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    const survey = new Survey(surveyData);
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get("/get-all-surveys", authenticateToken, async (req, res, next) => {
  try {
    const surveyData = await Survey.find();

    res.status(200).json({ surveys: surveyData });
  } catch (error) {
    next(error);
  }
});

router.get("/get-unique-districts", authenticateToken, async (req, res, next) => {
  try {
    const uniqueDistricts = await Survey.distinct('district');

    res.status(200).json({ uniqueDistricts: uniqueDistricts });
  } catch (error) {
    next(error);
  }
});

router.get("/survey/count", authenticateToken, async (req, res, next) => {
  try {
    const totalSurvey = await Survey.countDocuments();

    res.status(200).json({
      message: "Total Survey",
      count: totalSurvey,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-surveys/:userId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const userSurveys = await Survey.find({ userId: userId });

      res.status(200).json({ surveys: userSurveys });
    } catch (error) {
      next(error);
    }
  }
);

// router.get(
//   "/get-surveys-by-booth/:booth",
//   authenticateToken,
//   async (req, res, next) => {
//     try {
//       const { booth } = req.params;
//       const surveyData = await Survey.find({ Booth: booth });

//       res.status(200).json({ surveys: surveyData });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

router.get("/get-surveys-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    const booth = req.params.booth;
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const surveyData = await Survey.find({ Booth: booth });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const surveyData = await Survey.find({ Booth: booth, district: userRoles[0] });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const districtData = [];
      let boothDistrict;

      for (const district of userRoles) {
        const surveyData = await Survey.find({ Booth: booth, district: district });
        const districtInfo = { district, surveys: surveyData };
        districtData.push(districtInfo);

        if (district === booth) {
          boothDistrict = districtInfo;
        }
      }

      if (boothDistrict) {
        districtData.sort((a, b) => (a.district === booth ? -1 : b.district === booth ? 1 : 0));
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});



router.put(
  "/update-survey/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const updatedSurvey = await Survey.findByIdAndUpdate(
        surveyId,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({
        message: "Survey updated successfully",
        survey: updatedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-survey/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const deletedSurvey = await Survey.findByIdAndDelete(surveyId);

      res.status(200).json({
        message: "Survey deleted successfully",
        survey: deletedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/add-survey2", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    const survey = new Survey2(surveyData);
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get("/pramukh/count", authenticateToken, async (req, res, next) => {
  try {
    const totalSurvey = await Survey2.countDocuments();

    res.status(200).json({
      message: "Total Pramukh Data",
      count: totalSurvey,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/unique/pramukh/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const uniquePramukhNames = await Survey2.distinct("pramukhName");

      res.status(200).json({
        message: "Total Unique Pramukh Names",
        count: uniquePramukhNames.length,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-survey2-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const surveyData = await Survey2.find({ Booth: req.params.booth });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const surveyData = await Survey2.find({ Booth: req.params.booth, district: userRoles[0] });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const booth = req.params.booth;
      const districtData = [];

      for (const district of userRoles) {
        const surveyData = await Survey2.find({ Booth: booth, district: district });
        districtData.push({ district, surveys: surveyData });
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-all-the-survey2",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyData = await Survey2.find();

      res.status(200).json({ surveys: surveyData });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/get-the-survey2/:userId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const userSurveys = await Survey2.find({ userId: userId });

      res.status(200).json({ surveys: userSurveys });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/update-by-the-survey2/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const updatedSurvey = await Survey2.findByIdAndUpdate(
        surveyId,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({
        message: "Survey updated successfully",
        survey: updatedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-by-the-survey2/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const deletedSurvey = await Survey2.findByIdAndDelete(surveyId);

      res.status(200).json({
        message: "Survey deleted successfully",
        survey: deletedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/add-survey3", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    const survey = new Survey3(surveyData);
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-all-the-survey3",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyData = await Survey3.find();

      res.status(200).json({ surveys: surveyData });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/influentialleaders/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const totalSurvey = await Survey3.countDocuments();

      res.status(200).json({
        message: "Total influential leaders Data",
        count: totalSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/unique/influentialleaders/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const uniqueInfluentialLeadersNames = await Survey3.aggregate([
        { $unwind: "$influentialLeaders" },
        { $group: { _id: "$influentialLeaders.name" } },
        { $group: { _id: null, count: { $sum: 1 } } },
        { $project: { _id: 0, count: 1 } },
      ]);

      const count =
        uniqueInfluentialLeadersNames.length > 0
          ? uniqueInfluentialLeadersNames[0].count
          : 0;

      res.status(200).json({
        message: "Total Unique Influential Leaders Names",
        count: count,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/get-the-survey3/:userId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const userSurveys = await Survey3.find({ userId: userId });

      res.status(200).json({ surveys: userSurveys });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-survey3-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const surveyData = await Survey3.find({ Booth: req.params.booth });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const surveyData = await Survey3.find({ Booth: req.params.booth, district: userRoles[0] });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const booth = req.params.booth;
      const districtData = [];

      for (const district of userRoles) {
        const surveyData = await Survey3.find({ Booth: booth, district: district });
        districtData.push({ district, surveys: surveyData });
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  "/update-by-the-survey3/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const updatedSurvey = await Survey3.findByIdAndUpdate(
        surveyId,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({
        message: "Survey updated successfully",
        survey: updatedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-by-the-survey3/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const deletedSurvey = await Survey3.findByIdAndDelete(surveyId);

      res.status(200).json({
        message: "Survey deleted successfully",
        survey: deletedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/add-survey4", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    const survey = new Survey4(surveyData);
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-all-the-survey4",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyData = await Survey4.find();

      res.status(200).json({ surveys: surveyData });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/influentialpersons/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const totalSurvey = await Survey4.countDocuments();

      res.status(200).json({
        message: "Total influential persons Data",
        count: totalSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/unique/influentialpersons/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const uniqueInfluentialLeadersNames = await Survey4.aggregate([
        { $unwind: "$influentialpersons" },
        { $group: { _id: "$influentialpersons.name" } },
        { $group: { _id: null, count: { $sum: 1 } } },
        { $project: { _id: 0, count: 1 } },
      ]);

      const count =
        uniqueInfluentialLeadersNames.length > 0
          ? uniqueInfluentialLeadersNames[0].count
          : 0;

      res.status(200).json({
        message: "Total Unique Influential Persons Names",
        count: count,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/get-the-survey4/:userId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const userSurveys = await Survey4.find({ userId: userId });

      res.status(200).json({ surveys: userSurveys });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-survey4-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const surveyData = await Survey4.find({ Booth: req.params.booth });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const surveyData = await Survey4.find({ Booth: req.params.booth, district: userRoles[0] });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const booth = req.params.booth;
      const districtData = [];

      for (const district of userRoles) {
        const surveyData = await Survey4.find({ Booth: booth, district: district });
        districtData.push({ district, surveys: surveyData });
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  "/update-by-the-survey4/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const updatedSurvey = await Survey4.findByIdAndUpdate(
        surveyId,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({
        message: "Survey updated successfully",
        survey: updatedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-by-the-survey4/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const deletedSurvey = await Survey4.findByIdAndDelete(surveyId);

      res.status(200).json({
        message: "Survey deleted successfully",
        survey: deletedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/add-survey5", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    const survey = new Survey5(surveyData);
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-all-the-survey5",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyData = await Survey5.find();

      res.status(200).json({ surveys: surveyData });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/probablejoinees/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const totalSurvey = await Survey5.countDocuments();

      res.status(200).json({
        message: "Total probable joinees Data",
        count: totalSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/unique/probableJoinees/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const uniqueInfluentialLeadersNames = await Survey5.aggregate([
        { $unwind: "$probableJoinees" },
        { $group: { _id: "$probableJoinees.name" } },
        { $group: { _id: null, count: { $sum: 1 } } },
        { $project: { _id: 0, count: 1 } },
      ]);

      const count =
        uniqueInfluentialLeadersNames.length > 0
          ? uniqueInfluentialLeadersNames[0].count
          : 0;

      res.status(200).json({
        message: "Total Unique Probable Joinees Names",
        count: count,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/get-the-survey5/:userId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const userSurveys = await Survey5.find({ userId: userId });

      res.status(200).json({ surveys: userSurveys });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-survey5-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const surveyData = await Survey5.find({ Booth: req.params.booth });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const surveyData = await Survey5.find({ Booth: req.params.booth, district: userRoles[0] });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const booth = req.params.booth;
      const districtData = [];

      for (const district of userRoles) {
        const surveyData = await Survey5.find({ Booth: booth, district: district });
        districtData.push({ district, surveys: surveyData });
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  "/update-by-the-survey5/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const updatedSurvey = await Survey5.findByIdAndUpdate(
        surveyId,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({
        message: "Survey updated successfully",
        survey: updatedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-by-the-survey5/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const deletedSurvey = await Survey5.findByIdAndDelete(surveyId);

      res.status(200).json({
        message: "Survey deleted successfully",
        survey: deletedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/add-survey6", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    const survey = new Survey6(surveyData);
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-all-the-survey6",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyData = await Survey6.find();

      res.status(200).json({ surveys: surveyData });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/leadersdisgruntled/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const totalSurvey = await Survey6.countDocuments();

      res.status(200).json({
        message: "Total leaders disgruntled Data",
        count: totalSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/unique/leadersDisgruntled/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const uniqueInfluentialLeadersNames = await Survey6.aggregate([
        { $unwind: "$leadersDisgruntled" },
        { $group: { _id: "$leadersDisgruntled.name" } },
        { $group: { _id: null, count: { $sum: 1 } } },
        { $project: { _id: 0, count: 1 } },
      ]);

      const count =
        uniqueInfluentialLeadersNames.length > 0
          ? uniqueInfluentialLeadersNames[0].count
          : 0;

      res.status(200).json({
        message: "Total Unique Leaders Disgruntled Names",
        count: count,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/get-the-survey6/:userId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const userSurveys = await Survey6.find({ userId: userId });

      res.status(200).json({ surveys: userSurveys });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-survey6-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const surveyData = await Survey6.find({ Booth: req.params.booth });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const surveyData = await Survey6.find({ Booth: req.params.booth, district: userRoles[0] });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const booth = req.params.booth;
      const districtData = [];

      for (const district of userRoles) {
        const surveyData = await Survey6.find({ Booth: booth, district: district });
        districtData.push({ district, surveys: surveyData });
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  "/update-by-the-survey6/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const updatedSurvey = await Survey6.findByIdAndUpdate(
        surveyId,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({
        message: "Survey updated successfully",
        survey: updatedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-by-the-survey6/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const deletedSurvey = await Survey6.findByIdAndDelete(surveyId);

      res.status(200).json({
        message: "Survey deleted successfully",
        survey: deletedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/add-survey7", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    const survey = new Survey7(surveyData);
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-all-the-survey7",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyData = await Survey7.find();

      res.status(200).json({ surveys: surveyData });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/currentmlaperception/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const totalSurvey = await Survey7.countDocuments();

      res.status(200).json({
        message: "Total current mla perception Data",
        count: totalSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/get-the-survey7/:userId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const userSurveys = await Survey7.find({ userId: userId });

      res.status(200).json({ surveys: userSurveys });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-survey7-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const surveyData = await Survey7.find({ Booth: req.params.booth });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const surveyData = await Survey7.find({ Booth: req.params.booth, district: userRoles[0] });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const booth = req.params.booth;
      const districtData = [];

      for (const district of userRoles) {
        const surveyData = await Survey7.find({ Booth: booth, district: district });
        districtData.push({ district, surveys: surveyData });
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  "/update-by-the-survey7/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const updatedSurvey = await Survey7.findByIdAndUpdate(
        surveyId,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({
        message: "Survey updated successfully",
        survey: updatedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-by-the-survey7/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const deletedSurvey = await Survey7.findByIdAndDelete(surveyId);

      res.status(200).json({
        message: "Survey deleted successfully",
        survey: deletedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/add-survey8", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    const survey = new Survey8(surveyData);
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-all-the-survey8",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyData = await Survey8.find();

      res.status(200).json({ surveys: surveyData });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/reasonforshswinloss/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const totalSurvey = await Survey8.countDocuments();

      res.status(200).json({
        message: "Total reason For Shs Win Loss Data",
        count: totalSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/get-the-survey8/:userId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const userSurveys = await Survey8.find({ userId: userId });

      res.status(200).json({ surveys: userSurveys });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-survey8-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const surveyData = await Survey8.find({ Booth: req.params.booth });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const surveyData = await Survey8.find({ Booth: req.params.booth, district: userRoles[0] });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const booth = req.params.booth;
      const districtData = [];

      for (const district of userRoles) {
        const surveyData = await Survey8.find({ Booth: booth, district: district });
        districtData.push({ district, surveys: surveyData });
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  "/update-by-the-survey8/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const updatedSurvey = await Survey8.findByIdAndUpdate(
        surveyId,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({
        message: "Survey updated successfully",
        survey: updatedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-by-the-survey8/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const deletedSurvey = await Survey8.findByIdAndDelete(surveyId);

      res.status(200).json({
        message: "Survey deleted successfully",
        survey: deletedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/add-survey9", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    const survey = new Survey9(surveyData);
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-all-the-survey9",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyData = await Survey9.find();

      res.status(200).json({ surveys: surveyData });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/administrativeissues/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const totalSurvey = await Survey9.countDocuments();

      res.status(200).json({
        message: "Total administrative issues Data",
        count: totalSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/get-the-survey9/:userId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const userSurveys = await Survey9.find({ userId: userId });

      res.status(200).json({ surveys: userSurveys });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-survey9-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const surveyData = await Survey9.find({ Booth: req.params.booth });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const surveyData = await Survey9.find({ Booth: req.params.booth, district: userRoles[0] });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const booth = req.params.booth;
      const districtData = [];

      for (const district of userRoles) {
        const surveyData = await Survey9.find({ Booth: booth, district: district });
        districtData.push({ district, surveys: surveyData });
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});
router.put(
  "/update-by-the-survey9/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const updatedSurvey = await Survey9.findByIdAndUpdate(
        surveyId,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({
        message: "Survey updated successfully",
        survey: updatedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-by-the-survey9/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const deletedSurvey = await Survey9.findByIdAndDelete(surveyId);

      res.status(200).json({
        message: "Survey deleted successfully",
        survey: deletedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/add-survey10", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    const survey = new Survey10(surveyData);
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-all-the-survey10",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyData = await Survey10.find();

      res.status(200).json({ surveys: surveyData });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/suggestionscomplaints/count",
  authenticateToken,
  async (req, res, next) => {
    try {
      const totalSurvey = await Survey10.countDocuments();

      res.status(200).json({
        message: "Total suggestions complaints Data",
        count: totalSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/get-the-survey10/:userId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const userSurveys = await Survey10.find({ userId: userId });

      res.status(200).json({ surveys: userSurveys });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-survey10-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const surveyData = await Survey10.find({ Booth: req.params.booth });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const surveyData = await Survey10.find({ Booth: req.params.booth, district: userRoles[0] });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const booth = req.params.booth;
      const districtData = [];

      for (const district of userRoles) {
        const surveyData = await Survey10.find({ Booth: booth, district: district });
        districtData.push({ district, surveys: surveyData });
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  "/update-by-the-survey10/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const updatedSurvey = await Survey10.findByIdAndUpdate(
        surveyId,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({
        message: "Survey updated successfully",
        survey: updatedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-by-the-survey10/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const deletedSurvey = await Survey10.findByIdAndDelete(surveyId);

      res.status(200).json({
        message: "Survey deleted successfully",
        survey: deletedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/add-survey11", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const surveyData = { ...req.body, userId: userId };

    const survey = new Survey11(surveyData);
    const savedSurvey = await survey.save();

    res
      .status(201)
      .json({ message: "Survey saved successfully", survey: savedSurvey });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-all-the-survey11",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyData = await Survey11.find();

      res.status(200).json({ surveys: surveyData });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/caste/count", authenticateToken, async (req, res, next) => {
  try {
    const totalSurvey = await Survey11.countDocuments();

    res.status(200).json({
      message: "Total caste Data",
      count: totalSurvey,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/get-the-survey11/:userId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const userSurveys = await Survey11.find({ userId: userId });

      res.status(200).json({ surveys: userSurveys });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-survey11-by-booth/:booth", authenticateToken, async (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    console.log('userRoles::: ', userRoles);

    if (userRoles.includes('admin') || userRoles.includes('mod') || userRoles.includes('user')) {
      const surveyData = await Survey11.find({ Booth: req.params.booth });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length === 1 && userRoles[0] !== 'user') {
      const surveyData = await Survey11.find({ Booth: req.params.booth, district: userRoles[0] });
      res.status(200).json({ surveys: surveyData });
    } else if (userRoles.length > 0) {
      const booth = req.params.booth;
      const districtData = [];

      for (const district of userRoles) {
        const surveyData = await Survey11.find({ Booth: booth, district: district });
        districtData.push({ district, surveys: surveyData });
      }

      res.status(200).json({ districts: districtData });
    } else {
      res.status(403).json({ error: "User roles not available" });
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  "/update-by-the-survey11/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const updatedSurvey = await Survey11.findByIdAndUpdate(
        surveyId,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json({
        message: "Survey updated successfully",
        survey: updatedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete-by-the-survey11/:surveyId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const surveyId = req.params.surveyId;
      const deletedSurvey = await Survey11.findByIdAndDelete(surveyId);

      res.status(200).json({
        message: "Survey deleted successfully",
        survey: deletedSurvey,
      });
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
