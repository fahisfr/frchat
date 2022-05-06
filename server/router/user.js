const router = require('express').Router();
const updadteProfile = require('../controller/user');
const saveImage = require('../controller/saveImage');
const saveMessages = require('../controller/saveMessages');





router.post('/update', saveImage.single("photo"), updadteProfile)
router.post('/messages',saveMessages )



module.exports = router;