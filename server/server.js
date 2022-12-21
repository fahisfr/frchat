require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const port = 4000;
const connectDb = require("./config/dbConn");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

connectDb();

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        throw Error("token not vaild");
      }
      next();
    });
  } else {
    next(new Error("token not found"));
  }
});

io.on("connection", (socket) => {
  console.log("User Connected");
  socket.on("disconnect", () => {
    console.log("User Disconnect");
  });
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/message", require("./routes/message"));

app.use((error, req, res, next) => {
  res.json({ status: "error", error: "Internal server error" });
});

server.listen(port, () => console.log(`server running port ${port}`));
