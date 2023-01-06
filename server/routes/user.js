const router = require("express").Router();
const { editProfile } = require("../controllers/user");
router.put("/edit-profile", editProfile);

module.exports = router;
