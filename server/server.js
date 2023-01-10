require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const port = 4000;
const connectDb = require("./config/dbConn");
const morgan = require("morgan");
const cors = require("cors");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const dbUser = require("./dbSChemas/user");

connectDb();

io.use(require("./eventHandlers/handshake"));
io.on("connection", require("./eventHandlers/onConnection"));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(require("./config/corsOptions")));
app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.use("/api/message", require("./routes/message"));
app.use("/api/contact", auth, require("./routes/contact"));
app.use("/api/user", require("./routes/user"));
app.use(require("./config/errorHandler"));

server.listen(port, () => console.log(`server running port ${port}`));
