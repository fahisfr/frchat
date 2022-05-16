const router = require('express').Router();
const updadteProfile = require('../controller/user');
const saveImage = require('../controller/saveImage');
const apiValidation = require('../middleware/apiValidation');


router.post('/update-profile', saveImage.single("photo"),
    apiValidation('update-proflie'), updadteProfile)




module.exports = router;