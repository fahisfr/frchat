const router = require("express").Router();
const SingupController = require("../Controller/Singup");


router.post("/", SingupController.singup);
router.post("/verify", SingupController.verify);



module.exports = router;