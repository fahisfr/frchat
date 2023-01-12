const dbUser = require("../dbSChemas/user");
const jwt = require("jsonwebtoken");

const createTokens = (info) => {
  return {
    refreshToken: jwt.sign(info, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    }),
    accessToken: jwt.sign(info, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3s",
    }),
  };
};

const login = async (req, res, next) => {
  try {
    res.json({ status: "ok" });
  } catch (error) {
    next(error);
  }
};

const editProfile = async (req, res, next) => {
  // try {
  //   const {
  //     body: { about },
  //     files,
  //     user: { id },
  //   } = req;

  //   const updatedInfo = {};

  //   if (about) {
  //     updatedInfo.about = about;
  //   }
  //   if (files?.profiePhoto) {
  //     updatedInfo.profile = files.profiePhoto;
  //   }

    // const dbRes = await dbUser.updateOne(
    //   { _id: id },
    //   {
    //     $set: {
    //       ...updatedInfo,
    //     },
    //   }
    // );

  //   if (false) {
  //     return res.json({ status: "ok" });
  //   }
  //   res.json({ status: "error", error: "Failed to update profile" });
  // } catch (error) {
  //   next(error);
  // }
};

const verifyOtp = async (req, res, next) => {
  const { number } = req.body;

  const user = await dbUser.findOne({ number });
  if (user) {
    const { accessToken, refreshToken } = createTokens({ id: user._id });
    res.cookie("frchat_refresh_token", refreshToken, { maxAge: 900000 });
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
    console.log(req.cookies);
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
