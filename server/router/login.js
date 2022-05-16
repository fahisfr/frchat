const router = require("express").Router();
const LoignController = require("../controller/login");
const apiValidation = require("../middleware/apiValidation");

router.post("/",apiValidation("login"), LoignController.login);
router.post("/otp-verify",apiValidation("otp-verify"), LoignController.verify)



module.exports = router;