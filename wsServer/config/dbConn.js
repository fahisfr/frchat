
const mongoClient = require('mongodb').MongoClient;

let  dbConnection 

module.exports={
    connect: (callback) => {
        mongoClient.connect(process.env.DATA_BASE_URL)
            .then(client => {
                dbConnection = client.db()
                console.log('DB connected')
                callback()
            }).catch(err => {
                console.log(err)
                return callback(err)
            })   
    },
    get: () => dbConnection,
}