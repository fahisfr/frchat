const redis = require("redis")


const redisClient = redis.createClient({
    host: "localhost",
    port: 6360
})

redisClient.connect()

module.exports = redisClient