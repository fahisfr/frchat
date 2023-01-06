const router = require("express").Router();

const { addContact, changeName } = require("../controllers/contact");
router.post("/add-contact", addContact);
router.put("/change-name", changeName);

module.exports = router;
