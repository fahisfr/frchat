const db = require("../Config/DBconn")
const multer = require("multer")


const UpdadteProfile = (req, res,next) => {
    try {
        const { number } = req.user
        const { name, photo } = req.body
       

        db.get().collectioin("users").updateOne({ number }, { $set: { name, photo } })
            .then(result => res.json({ success: true, message: "profile updated successfully" }))
            .catch(err => res.json({ success: false, message: "filed to update your profile" }))
        
    } catch (error) {
        next(error)
    }
}

module.exports = UpdadteProfile





