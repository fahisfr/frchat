const joi =require("joi")

const Singup = joi.object({
    name: joi.string().required(),
    number: joi.string().required(),
    password: joi.string().required(),
    conforimpassword: joi.string().required(),
})

const Login = joi.object({
    number: joi.string().required(),
    password: joi.string().required(),
})

const OtpVrify = joi.object({
    name: joi.string(),
    number: joi.string().required(),
    otp: joi.string().required(),
})
const removeContact = joi.object({
    number: joi.number().required(),
})


const removeContactApiValidation = (req, res, next) => {
    const { error } = removeContact.validate(req.body)
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error.details[0].message
        })
    }
    next()
}



const SingupApiValidation = (req, res, next) => {
    const { error } = Singup.validate(req.body)
    if (error) return res.status(400).json({ success: false, message: error.details[0].message })
    next()

}

module.exports = {
    SingupApiValidation,
    removeContactApiValidation
}