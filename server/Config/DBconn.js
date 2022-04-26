
const mongoClient = require('mongodb').MongoClient;

let  dbConnection 

module.exports={
    connect: () => {
        mongoClient.connect(process.env.DATA_BASE_URL)
            .then(client => {
                dbConnection = client.db()
                console.log("connected to db")
            }).catch(err => {
                console.log("Error in connecting to DB")
            })   
    },
    get: () => dbConnection,
}