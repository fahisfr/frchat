const router = require("express").Router();
const SingupController = require("../controller/singup");
const apiValidation = require("../middleware/apiValidation");


router.post("/",apiValidation("singup"), SingupController.singup);
router.post("/otp-verify",apiValidation("otp-verify"), SingupController.verify);



module.exports = router;