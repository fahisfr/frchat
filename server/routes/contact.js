const router = require("express").Router();

const { addContact, changeName } = require("../controllers/contact");
router.post("/add-contact", addContact);
router.put("/change-name", changeName);
router.put("/remove-contact",);

module.exports = router;
