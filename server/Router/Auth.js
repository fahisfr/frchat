const router = require("express").Router();
const db = require("../Config/DBconn");
const Auth = require("../Controller/Auth");

router.get("/", Auth.Authentication);
router.get("/verify", Auth.Re_Authentication);



module.exports = router;