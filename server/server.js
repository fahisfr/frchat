require("dotenv").config();
const express = require("express");
const morgan =require("morgan")
const port = 4001
const app = express()
const db = require("./config/dbConn")
const errorHandler = require("./config/errorHandler")
const path = require("path")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const corsOptions = require("./config/corsOptions")
const isAuth = require("./middleware/userAuth");





db.connect()
app.use(cors(corsOptions))
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"public")))

app.use("/api/auth", require("./router/auth"))
app.use('/api/singup', require("./router/singup"))
app.use("/api/login", require("./router/login"))

app.use("/api/contact", isAuth, require("./router/contact"))
app.use("/api/user", isAuth, require("./router/user"))

app.use(errorHandler)


app.listen(port)
