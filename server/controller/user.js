const db = require("../config/dbConn")
const multer = require('multer')


const UpdadteProfile = async (req, res, next) => {
    try {
        const { file, body: { name, }, user: { number } } = req;
        const imageName = `${number}-${name}.${file.mimetype.split('/')[1]}`
        db.get().collection("users").updateOne({ number }, { $set: { photo: imageName, name } })
            .then(result => res.json({success:true,name,photo:imageName,message:"profile updated successfuly"}))
       
        
    } catch (error) {
        next(error)
    }
}

module.exports = UpdadteProfile





