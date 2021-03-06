const joi = require("joi")

const singup = joi.object({
    name: joi.string().required(),
    number: joi.number().required(),
})

const login = joi.object({
    number: joi.number().required(),
})

const otpVerify = joi.object({
    name: joi.string(),
    number: joi.number().required(),
    otp: joi.string().required(),
})

const removeContact = joi.object({
    number: joi.number().required(),
    saved: joi.boolean().required(),
})

const addContact = joi.object({
    name: joi.string().required(),
    number: joi.number().required(),
})

const updatePorfie = joi.object({
    name: joi.string().required(),
    photo:joi.any()
})

const updateContact = joi.object({
    name: joi.string().required(),
    number: joi.number().required(),
})

const getSchema = (apiName) => {

    switch (apiName) {
        case "singup":
            return singup
        case "login":
            return login
        case "otp-verify":
            return otpVerify
        case "add-contact":
            return addContact
        case "update-proflie":
            return updatePorfie
        case "remove-contact":
            return removeContact
        case "update-contact":
            return updateContact
    }
}


const apiValidation = (apiName) => {
    return (req, res, next) => {
        const { error } = getSchema(apiName).validate(req.body, { "convert": false })
        error ? res.json({ success: false, message: error.details[0].message }) : next()

    }
}


module.exports = apiValidation
