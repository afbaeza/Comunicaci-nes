const path = require('path');
const express = require('express');
const http = require('http');
const SocketIo = require('socket.io');
var bodyParser = require('body-parser')


const queries = require('./queries')

const app = express();

var server = app.listen(3000, () => {
  console.log("Server on port 3000")
});

 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

var io = SocketIo.listen(server);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// Execute Queries

queries.module.postes()

io.on('connection', async function(socket) {
  console.log('client connected');

  socket.on('server:postes', async function(data) {

    await queries.module.postes()

    await io.emit('client:postes', {
      postes: queries.module.postesData
    })

    socket.on('server:id', function(data) {

      console.log('data : ', data)
    
      function intervalFunc() {
        io.emit('arduino:data', {
          value: parseInt(random(1, 100)),
          id: data.id
        })
      }
      
      setInterval(intervalFunc,500);
    })

  });

});


app.get('/', function (request, response) {
  response.render('index.html');
})

app.post('/data', function(request, response) {
  console.log(request.body);
  response.send('Received');
})


function random(low, high) {
  return Math.random() * (high - low) + low
}




