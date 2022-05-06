const router = require("express").Router();
const Contact = require("../controller/contact");
const apivalidation = require("../ApiValidation/api");

router.post("/", Contact.AddContact).
      put("/", apivalidation.removeContactApiValidation ,Contact.RemoveContact)
      




module.exports = router;