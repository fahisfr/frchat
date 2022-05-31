const router = require("express").Router();
const contact = require("../controller/contact");
const apiValidation = require("../middleware/apiValidation");


router.post("/add-contact",apiValidation("add-contact"), contact.addContact)
router.put("/remove-contact", apiValidation("remove-contact"), contact.removeContact)
router.put("/update-contact", apiValidation("update-contact"), contact.updateContact)
      


module.exports = router;