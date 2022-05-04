const router = require('express').Router();
const updadteProfile = require('../controller/user');
const saveImage = require('../controller/saveImage');





router.post('/update',saveImage.single("photo"),updadteProfile,)



module.exports = router;