const dbUser = require("../dbSChemas/user");
const jwt = require("jsonwebtoken");
const createTokens = (info) => {
  return {
    refreshToken: jwt.sign(info, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "40d",
    }),
    accessToken: jwt.sign(info, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    }),
  };
};

const login = async (req, res, next) => {
  try {
    const { number } = req.body;
    const { accessToken, refreshToken } = createTokens({ number });
    const user = await dbUser.findOne({ number });
    if (user) {
      res.cookie("auth_token", refreshToken, { maxAge: 900000 });
      res.json({ status: "ok", token: accessToken });
      user.refreshToken = refreshToken;
      user.save();
      return;
    }
    const createUser = await dbUser.create({
      number,
      refreshToken: refreshToken,
    });
    if (createUser) {
      res.json({ status: "ok", token: accessToken });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  login,
};
