require("dotenv").config();
const express = require("express");
const morgan =require("morgan")
const port = 4001
const app = express()
const db = require("./Config/DBconn")
const errorHandler = require("./Config/ErrorHandler")

const cors = require("cors")
const corsOptions =require("./Config/corsOptions")



db.connect()

app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan("dev"))

app.use('/api/singup', require("./Router/Singup"))
app.use("/api/login", require("./Router/Login"))
app.use("/api/auth", require("./Router/Auth"))
// app.use("/api/contact", require("./Router/Contact"))

app.use(errorHandler)

app.listen(port, () => console.log())
