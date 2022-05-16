const router = require("express").Router();
const Contact = require("../controller/contact");
const apiValidation = require("../middleware/apiValidation");


router.post("/add-contact",apiValidation("add-contact"), Contact.AddContact)
router.put('/remove-contact',apiValidation("remove-contact"), Contact.RemoveContact)
      


module.exports = router;