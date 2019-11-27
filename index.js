const path = require('path');
const express = require('express');
const http = require('http');
const SocketIo = require('socket.io');
const pg = require('./conecctions/pg');

const app = express();

var server = app.listen(3000, () => {
  console.log("Server on port 3000")
});

var io = SocketIo.listen(server);

// static files
app.use(express.static(path.join(__dirname, 'public')));


var postes = undefined;

async function query(){
  postes = await pg.query('SELECT * FROM public.poste');

  var {rows} = postes;
  postes = rows;
  console.log(rows)
}

query()

io.on('connection', async function(socket) {
  console.log('client connected');

  socket.on('server:postes', async function(data) {

    await query()

    await io.emit('client:postes', {
      postes: postes
    })

    function intervalFunc() {
      io.emit('arduino:data', {
        value: parseInt(random(1, 100))
      })
    }
    
    setInterval(intervalFunc,500);

  });

});


app.get('/', function (request, response) {
  response.render('index.html');
})


function random(low, high) {
  return Math.random() * (high - low) + low
}


