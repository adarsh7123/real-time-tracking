// const express = require('express')
// const app = express()
// const path = require('path')


// const http = require('http')

// const socketio = require('socket.io')
// const server = http.createServer(app)
// const io = socketio(server)

// app.set("view engine", "ejs");
// app.set(express.static(path.join(__dirname,"public")));

// io.on("connected", function(socket) {
//     console.log("connected");
// });

// app.get('/', function (req, res) {
//   res.render("index")
// })

// server.listen(3000)

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

let users = {}; // To store user locations

// Set 'views' directory for any views being rendered
app.set('views', path.join(__dirname, 'views'));

// Set view engine as 'ejs'
app.set('view engine', 'ejs');

// Static files middleware for serving files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", function (socket) {
    console.log('A user connected');

    // Send existing users' locations to the newly connected user
    socket.emit("existing-locations", users);

    // Store the user's initial location
    socket.on("send-location", function (data) {
        users[socket.id] = data; // Update location for the user

        // Broadcast the updated location to all clients
        io.emit("recieve-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function () {
        // Remove user on disconnect
        delete users[socket.id];
        io.emit("user-disconnected", socket.id);
        console.log("A user disconnected");
    });
});

app.get('/', function (req, res) {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
