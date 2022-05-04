const router = require("express").Router();
const SingupController = require("../controller/singup");


router.post("/", SingupController.singup);
router.post("/verify", SingupController.verify);



module.exports = router;