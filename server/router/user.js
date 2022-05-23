const router = require('express').Router();
const saveImage = require('../controller/saveImage');
const apiValidation = require('../middleware/apiValidation');
const userController = require('../controller/user');


router.post('/update-profile', saveImage.single("photo"),
    apiValidation('update-proflie'), userController.UpdadteProfile);
router.post('/logout', userController.logout);




module.exports = router;