const router = require("express").Router();
const user = require("../controllers/user");
router.put("/edit-profile", user.editProfile);
router.post("/login", user.login);
router.post("/verify-otp", user.verifyOtp);
router.get("/refresh-token", user.verifyRefrshToken);

module.exports = router;
