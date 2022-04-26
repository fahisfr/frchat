const router = require("express").Router();
const LoignController = require("../Controller/Login");


router.post("/", LoignController.login);
router.post("/verify", LoignController.verify)



module.exports = router;