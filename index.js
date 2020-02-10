const path = require('path');
const express = require('express');
const http = require('http');
const SocketIo = require('socket.io');
var bodyParser = require('body-parser');


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

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Execute Queries

// optiene todos los postas registrados en la base de datos
queries.module.postes()

// Realiza una comunicación entre el Cliente (Navegador) y el Servidor
io.on('connection', async function(socket) {
  
  console.log('client connected');
 
  socket.on('server:postes', async function(data) {

    // consulta a la base de datos las coordenadas de los postes
    await queries.module.postes()

    // Envia las coordenadas de los postes al cliente (Navegador)
    await io.emit('client:postes', {
      postes: queries.module.postesData
    })


    socket.on('server:id', function(data) {

      console.log('data : ', data)
    
      async function intervalFunc() {
        await queries.module.getMedicion(data.id);

        var {potencia, corriente_pico, intensidad_rms, energia} = queries.module.medicion;
        // Consumo en Pesos $
        var consumo = energia*509.53;

        io.emit('arduino:data', {
          value: parseInt(random(1, 100)),
          id: data.id,
          energia: energia,
          consumo: consumo,
          potencia_instantanea: potencia
        })
      }
      
      setInterval(intervalFunc, 500);
    })

  });

});


app.get('/', function (request, response) {
  // Muestra la pagina principal en el navegador
  response.render('index');
})

app.post('/data', async function(request, response) {
  // request.body es de tipo JSON y tiene la siguiente estructura
  // { id: 1, ip: 6.2343, irms: 3.4534, potencia: 3.4323 }
  // donde:

  // id: es el identificador del poste en la base de datos
  // ip: es la Corriente Pico
  // irms: es la Intensidad RMS
  // potencia: es la potencia

  console.log(request.body);

  // Extraer los datos del formato JSON a variables
  var {id, ip, irms, potencia} = request.body;
  
  var { energia_acumulada } = await queries.module.getEnergiaAcumulada(id);

  var energia = energia_acumulada + (potencia / 3600000);
  // Guardar los datos en la base de datos
 await  queries.module.insertMedicion(id, ip, irms, potencia, energia);
  console.log('Data was saved sucessfull');
  response.status(200).send('OK');
})

app.get('/registrar-poste', function (request, response) {
  // Muestra el Formulario para registar postes
  response.render('registrar-poste');
});

app.post('/registrar-poste', async function(request, response) {
  // optiene los datos del formulario
  var {latitud, longitud} = request.body;
  
  // registra los datos en la base de datos
  var poste_id = await queries.module.registrarPoste(latitud, longitud);

  // muestra el identidicador en pantalla
  response.render('identificador-poste', {
    poste_id: poste_id
  });
})


function random(low, high) {
  return Math.random() * (high - low) + low
}




