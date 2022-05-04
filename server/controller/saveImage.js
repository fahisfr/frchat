
const multer = require('multer');


const upload = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/profile');
    },
    filename: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('only jpg,png,jpeg file allowed'));
        }
        const { file:image, body: { name, number } } = req;
        cb(null, `${req.user.number}-${name}.${file.mimetype.split('/')[1]}`);
      
    }
})

const store = multer({
    storage: upload,
})

module.exports = store;