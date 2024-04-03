import React, { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client"
import {Button, Container, TextField, Typography , Stack} from "@mui/material"

const App = () => {

  const socket = useMemo(() => io("http://localhost:3000" , {
    withCredentials: true,
  }) , []);

  const [message , setMesssage] = useState("");
  const [room , setRoom] = useState("");
  const [socketId , setSocketId] = useState("");

  //to get the messages on the screen
  const [messages , setMesssages] = useState([]);

  const [roomName , setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message" , { message, room } );
    setMesssage("");
  }

  //event for joinRoomHandler
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room" , roomName);
    setRoomName("");
  }

  useEffect(() => {
    socket.on("connect" , () => {
      setSocketId(socket.id)
      console.log("connected" , socket.id);

      socket.on("receive-message" , (data) => {
        console.log(data);
        setMesssages((messages) => [...messages , data]);
      })

      socket.on("welcome" , (s) => {
        console.log(s);
      });

      return () => {
        socket.disconnect();
      }
    })
  } , [])

  return (
    <Container maxWidth="sm">
      <Typography variant='h1' component={"div"} gutterBottom>
          Welcome to Socket.io
      </Typography>

      <Typography variant='h6' component={"div"} gutterBottom>
          {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField value={message} onChange={(e) => setMesssage(e.target.value)} id='outlined-basic' label='message' variant='outlined'/>

        <TextField value={room} onChange={(e) => setRoom(e.target.value)} id='outlined-basic' label='room' variant='outlined'/>

        <Button type='submit' variant='contained' color='primary'> Send </Button>
      </form>

      <Stack>
        {
          messages.map((m , i) => (
            <Typography key={i} variant='h6' component={"div"} gutterBottom>
              {m}
            </Typography>
          ))
        }
      </Stack>
    </Container>
  )
}

export default App