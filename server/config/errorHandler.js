module.exports = (error, req, res, next) => {
  console.log(error);
  res.json({ status: "error", message: "Internal server error" });
};
