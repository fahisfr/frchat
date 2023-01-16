const dbUser = require("../dbSChemas/user");
const jwt = require("jsonwebtoken");
const path = require("path");
const createTokens = (info) => {
  return {
    refreshToken: jwt.sign(info, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "90d",
    }),
    accessToken: jwt.sign(info, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    }),
  };
};

const login = async (req, res, next) => {
  
    res.json({ status: "ok" });

};



const editProfile = async (req, res, next) => {
  try {
    const {
      body: { about },
      files,
      user: { id },
    } = req;

    let profile = files?.profilePhoto;

    const updatedInfo = {};

    if (about) {
      updatedInfo.about = about;
    }

    if (profile) {
      const uniqueID =
        Date.now() + "-" + Math.random().toString(36).substr(2, 9);
      const profileName = uniqueID + "-" + profile.name;
      profile.name = profileName;
      updatedInfo.profile = profileName;
      const filePath = path.join(__dirname, "../public/profiles", profile.name);
      profile.mv(filePath);
    }

    if (Object.keys(updatedInfo).length === 0) {
      return res.json({
        status: "error",
        error: "No update information provided",
      });
    }

    const dbRes = await dbUser.updateOne(
      { _id: id },
      {
        $set: {
          ...updatedInfo,
        },
      }
    );

    if (dbRes.modifiedCount > 0) {
      return res.json({
        status: "ok", profile: updatedInfo
      });
    }
    res.json({ status: "error", error: "Failed to update profile" });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  const { number } = req.body;

  const user = await dbUser.findOne({ number });
  if (user) {
    const { accessToken, refreshToken } = createTokens({ id: user._id });
    res.cookie("frchat_refresh_token", refreshToken, {
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });
    res.json({ status: "ok", token: accessToken });
    user.refreshToken = refreshToken;
    user.save();
    return;
  }
  const createUser = await dbUser.create({
    number,
  });
  if (createUser) {
    const { accessToken, refreshToken } = createTokens({
      id: createUser._id,
    });
    res.json({ status: "ok", token: accessToken });
    createUser.refreshToken = refreshToken;
    createUser.save();
    return;
  }
};

const verifyRefrshToken = (req, res, next) => {
  try {

    const token = req.cookies?.frchat_refresh_token;
    if (!token) {
      return res.json({ status: "error", error: "token not found" });
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, result) => {
      if (err) {
        return res.json({ status: "error", error: "token not valid" });
      }
      const { accessToken } = createTokens({ id: result.id });
      res.json({ status: "ok", accessToken });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  editProfile,
  verifyOtp,
  verifyRefrshToken,
};
