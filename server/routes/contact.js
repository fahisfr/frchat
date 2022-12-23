const router = require("express").Router();

const { addContact } = require("../controllers/contact");
router.post("/add-contact", addContact);

module.exports = router;
