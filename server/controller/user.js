
const db = require("../config/dbConn")


const UpdadteProfile = async (req, res, next) => {

    try {

        const { file, body: { name, }, user: { number } } = req;
        if (!file) {
    
            const respose = await db.get().collection("users").updateOne({ number }, { $set: { name } })
            return res.json({ success: true, name, message: "profile updated successfuly" })
        }
        const imageName = `whychat_${req.user.number}_profile.${file.mimetype.split('/')[1]}`
        
        db.get().collection("users").updateOne({ number: parseInt(number) }, { $set: { photo: imageName, name } })
            .then(result => res.json({ success: true, name, photo: imageName, message: "profile updated successfuly" }))
            .catch(error => res.status.json({ success: false, message: "faild to update profile" }))



    } catch (error) {
        next(error)
    }
}

const logout = (req, res, next) => {
    try {
        const { user: { number } } = req;
        db.get().collection("users").updateOne({ number }, { $set: { refreshtoken: null } })
        return res.json({ success: true, message: "logout successfuly" })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    UpdadteProfile,
    logout,
}





