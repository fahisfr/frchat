

const twilio = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const create = async (number) => {
    return new Promise((resolve, reject) => {
        twilio.verify.services(process.env.TWILIO_SERVICE_id).
            verifications.create({ to:`+91${number}`, channel: "sms" })
            .then(response => resolve(response))
            .catch(err => reject(err))
    })
    
}

const verify = async (number, otp) => {
    return new Promise((resolve, reject) => {
        twilio.verify.services(process.env.TWILIO_SERVICE_id).
            verificationChecks.create({ to: `+91${number}`, code: otp })
            .then(response => resolve(response))
            .catch(err => { reject(err)})
    })
}




module.exports = {
    create,
    verify,

}