import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";

const secretKeyJwt = "saffdsfsafsfdsfdsgrgwew"
const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server , {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET" , "POST"],  
        credentials: true,
    }
});

app.use(cors());

app.get("/" , (req , res) => {
    res.send("Hello world");
})

app.get("/login" , (req , res) => {
    const token = jwt.sign({_id: "afdfdsfdsfdsfsf"} , secretKeyJwt)

    res.cookie("token" , token, {
        httpOnly:true,
        secure: true,
        sameSite: "none"
    }).json({
        message: "Login success",
    });
});

io.use((socket , next) => {
    cookieParser()(socket.request , socket.request.res, (err) => {

        if(err) return next(err);

        const token = socket.request.cookies.token ;    

        if(!token) return next(new Error("Authentication Error"))

        const decoded = jwt.verify(token , secretKeyJwt);

        next();

    })
})



// socket - individual user
// io - entire circuit
io.on("connection" , (socket) => {
    console.log("User connected" , socket.id);

    // socket.emit("welcome" , `welcome to the server, ${socket.id}`);

    //creating an event
    socket.on("message" , ({message , room}) => {
        console.log({message , room});

        // io.emit("receive-message" , {message}); this is for entire circuit

        // this is only for the individual circuit.
        // socket.broadcast.emit("receive-message" , {message}); 

        // to send a message for a particular room : 
        // socket.to(room).emit("receive-message" , message); 

        // to from a group use join() to put every circuit in the same room.
        socket.on("join-room", (room) => {
            socket.join(room);
            console.log(`User joined room ${room}`);
          });
    })

    socket.on("disconnect" , () => {
        console.log("User Disconnect" , socket.id);
    })
})

server.listen(port , () => {
    console.log(`Server is running on port ${port}`)
})