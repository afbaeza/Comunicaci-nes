const express = require('express')
const app = express()

app.use(express.static('public'));
 
app.get('/', function (request, response) {
    response.render('index.html')
})
 
app.listen(3000, () => {
    console.log("Servidor on port 3000")
})