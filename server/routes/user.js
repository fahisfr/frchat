const router = require("express").Router();
const user = require("../controllers/user");
const auth = require("../middleware/auth");
const {
  validateRequestBody,
  login,
  verifyOtp,
} = require("../middleware/apiValidation");

router.put("/edit-profile", user.editProfile);
router.post("/login", auth, validateRequestBody(login), user.login);
router.post("/verify-otp", validateRequestBody(verifyOtp), user.verifyOtp);
router.get("/refresh-token", user.verifyRefrshToken);

module.exports = router;
