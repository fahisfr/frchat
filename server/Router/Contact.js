const router = require("express").Router();
const Contact = require("../Controller/Contact");


router.post("/",Contact.AddContact)
      .delete("/",Contact.RemoveContact)




module.exports = router;