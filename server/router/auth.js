const router = require("express").Router();
const db = require("../config/dbConn");
const Auth = require("../controller/auth");

router.get("/",  Auth.Authentication);
router.get("/refresh", Auth.reAuthentication);



module.exports = router;