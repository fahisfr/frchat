
const joi = require("joi");

const login = joi.object({
  countryCode: joi.string().required(),
  number: joi.string().required(),
});
const verifyOtp = joi.object({
  countryCode: joi.string().required(),
  number: joi.string().required(),
  otp: joi.string().required(),
});

const contactNameAndNumber = joi.object({
  name: joi.string().required(),
  number: joi.number().required(),
});

const removeContact = joi.object({
  number: joi.number().required(),
});

const validateRequestBody = (schema) => async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.json({
        status: "error",
        message: error.details[0].message,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateRequestBody,
  login,
  verifyOtp,
  removeContact,
  contactNameAndNumber,
};
