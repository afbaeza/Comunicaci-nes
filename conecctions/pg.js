"use strict";

const pg = require("pg");

const conString = "pg://postgres:admin@localhost:5432/Comunicaciones";
//                     \_______/ \___/ \_______/ \__/ \_____________/
//                       user    pass    host   port     database

const client = new pg.Client(conString);

client.connect(function(err) {
  if (err) {
    return console.error("Conexion con postgreSQL no fue exitosa: ", err);
  }
  console.log("Conexion con postgreSQL exitosa");
});

module.exports = client;