const express = require('express')
const app = express()
const server = require('http').Server(app)
const cors=require("cors")
const io = require("socket.io")(server)
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:false,
        optionsSuccessStatus:200,
		methods: [ "GET", "POST" ]
    })
)
app.use(express.json())


io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

server.listen(3002,()=>{
    console.log('live stream socket on port 3002')
})