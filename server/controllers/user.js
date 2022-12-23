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

    const user = await dbUser.findOne({ number });
    if (user) {
      const { accessToken, refreshToken } = createTokens({ id: user._id });
      res.cookie("auth_token", refreshToken, { maxAge: 900000 });
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
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
