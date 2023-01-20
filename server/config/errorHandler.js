module.exports = (error, req, res, next) => {
  console.log(error);
  res.json({
    status: "error",
    message:
      "Sorry, the server is currently experiencing issues. Please try again later :(",
  });
};
