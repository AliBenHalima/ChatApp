var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");


var indexRouter = require('./routes/index');
var UsersAuthentification = require('./routes/UsersAuthentification');
const Auth = require("./Middleware/Auth");
var Test = require('./routes/Test');

const http = require('http');
const FormatMessage = require('./Utils/message');
const { JoinUser,UserLeave,RoomUsers } = require('./Utils/users');

// const socketio = require('socket.io');
const server = http.createServer(app);
const ChatBot= "ChatBot";
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
io.on('connection', (socket) => {
  socket.on("JoinRoom",({username,room})=>{
    const user = JoinUser(socket.id,username,room)
    socket.join(user.room);

    socket.broadcast.to(user.room).emit("message",FormatMessage(ChatBot,` ${user.username} has Joined the chat`));
    io.to(user.room).emit("roomUsers",{
      room_:user.room,
      users_:RoomUsers(user.room)
      
    })
    // console.log(RoomUsers(user.room))
    socket.on("typing",()=>{
      socket.to(user.room).emit("typing","SOmeone is typing")
    })
  });
  

  // console.log('a user connected');
  // socket.emit("message","Hello World");
  
  
    socket.on("Chatmessage",(message)=>{
      console.log("message is ",message)
      io.emit("message",FormatMessage("User",message))
    });
    socket.on("disconnect",()=>{
      const user = UserLeave(socket.id);
      if(user){
        io.to(user.room).emit("message",FormatMessage(ChatBot,` ${user.username} has Left the chat`));
        io.to(user.room).emit("roomUsers",{
          room:user.room,
          users:RoomUsers(user.room)
        })
      }
    
     
    });
});













var app = express();
app.use(cors());
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// const io= socketio(server);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/users",UsersAuthentification);
app.use("/test",Auth,Test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(express.static(__dirname + '/images'));




mongoose
  .connect(
    "mongodb+srv://Ali:mypassword@cluster0.jdfda.mongodb.net/<ChatApp>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    console.log("Connection successfully established");
    server.listen(3000);
  })
  .catch((err) => {
    console.log(err); 
  });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
