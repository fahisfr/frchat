const router = require("express").Router();

const contact = require("../controllers/contact");
router.post("/add-contact", contact.addContact);
router.put("/change-name", contact.changeName);
router.put("/remove-contact", contact.removeContact);

module.exports = router;
