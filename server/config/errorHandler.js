const ApiErrors = require('./apiErrors')

const errorHandler = (err, req, res, next) => {
    console.log(err)
    if (err instanceof ApiErrors) {
        res.status(err.statusCode).json({ success: false, message: err.message, });
        return;
    }
    res.status(500).json({ success: false, message: "Internal server error", });
}

module.exports = errorHandler;