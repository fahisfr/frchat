const router = require("express").Router();
const Contact = require("../controller/contact");


router.post("/",Contact.AddContact)
      .delete("/",Contact.RemoveContact)




module.exports = router;