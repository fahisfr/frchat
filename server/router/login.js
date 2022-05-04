const router = require("express").Router();
const LoignController = require("../controller/login");


router.post("/", LoignController.login);
router.post("/verify", LoignController.verify)



module.exports = router;