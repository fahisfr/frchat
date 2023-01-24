const router = require("express").Router();
const user = require("../controllers/user");
const auth = require("../middleware/auth");
const {
  validateRequestBody,
  login,
  verifyOtp,
  editProfile,
} = require("../middleware/apiValidation");

router.put(
  "/edit-profile",
  validateRequestBody(editProfile),
  auth,
  user.editProfile
);
router.post("/login", validateRequestBody(login), user.login);
router.post("/verify-otp", validateRequestBody(verifyOtp), user.verifyOtp);
router.get("/refresh-token", user.verifyRefrshToken);

module.exports = router;
