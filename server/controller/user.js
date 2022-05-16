const db = require("../config/dbConn")
const multer = require('multer');
const { connect } = require("../../wsServer/config/redis");


const UpdadteProfile = async (req, res, next) => {
    try {
        const { file, body: { name, }, user: { number } } = req;
        if (!file) {
            console.log("no file")
            const respose = await db.get().collection("users").updateOne({ number }, { $set: { name } })
            return res.json({ success: true, name, message: "profile updated successfuly" })
        }
        console.log(file)
        console.log(number)
        const imageName = `whychat_${req.user.number}_profile.${file.mimetype.split('/')[1]}`
        const respose = await db.get().collection("users").updateOne({ number }, { $set: { photo: imageName, name } })

        res.json({ success: true, name, photo: imageName, message: "profile updated successfuly" })
        
    } catch (error) {
        next(error)
    }
}

module.exports = UpdadteProfile





