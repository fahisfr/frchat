const router = require("express").Router();
const contact = require("../controllers/contact");
const {
  validateRequestBody,
  removeContact,
  contactNameAndNumber,
} = require("../middleware/apiValidation");
router.post(
  "/add-contact",
  validateRequestBody(contactNameAndNumber),
  contact.addContact
);
router.put(
  "/change-name",
  validateRequestBody(contactNameAndNumber),
  contact.changeName
);
router.put(
  "/remove-contact",
  validateRequestBody(removeContact),
  contact.removeContact
);

module.exports = router;
