// Inicialización del canal de comunicación entre
// el Cliente (Navegador) y el Servidor
const socket = io();

// Inicialización de la variable que contiene el mapa
var map = undefined;

// Imagen que representa al poste en el mapa
var markerImg = {
    lamppost : 'https://i.ibb.co/LgztTNk/lamppost.png'
}

// Esta función modifica el html del marcador dinamicamente
function contentString(id, lat, lng, potenciaI, energia, consumo) {
    var content = '<div id="content">'+
    '<div id="siteNotice">'+
        '</div>'+
            `<h1 id="firstHeading" class="firstHeading">Poste ${id}</h1>`+
            '<div id="bodyContent">'+
            '<ul>'+
                `<li>Latitud: ${lat}</li>`+
                `<li>Longitud: ${lng}</li>`+
                `<li id="potencia-i-${id}">P Instantanea: ${potenciaI} [W]</li>`+
                `<li id="energia-${id}">Energia A: ${energia} [Kwh]</li>`+
                `<li id="consumo-${id}">Consumo: ${consumo}[$] </li>`+
            '</ul>'+
        '</div>'+
    '</div>';
    return content
}

// Array con los marcadores de los postes en el mapa
var markets = []

socket.on('arduino:data', function (data) {
    console.log(data);
    var potenciaI = document.getElementById('potencia-i-'+data.id);
    var energia = document.getElementById('energia-'+data.id);
    var consumo = document.getElementById('consumo-'+data.id);

    potenciaI.innerHTML = 'P Instantanea: ' + data.potencia_instantanea+' [W]';
    energia.innerHTML = 'Energia A: ' + data.energia + ' [Kwh]';
    consumo.innerHTML = 'Consumo:  ' + data.consumo + ' [$]';
})


socket.on('client:postes', function (data) {

    const infoWindow = new google.maps.InfoWindow({
        maxWidth: 200
    })

    function register(poste) {
        var marker = new google.maps.Marker({
            position: {
                lat: parseFloat(poste.latitud),
                lng: parseFloat(poste.longitud)
            },
            map: map,
            icon: markerImg.lamppost
        });

        marker.addListener('click', function() {

            infoWindow.setContent(contentString(
                poste.poste_id,
                parseFloat(poste.latitud),
                parseFloat(poste.longitud), 0, 0)
            );

            infoWindow.open(map, marker);

            console.log('server:id', poste.poste_id)
            console.log('socket', socket)

            socket.emit('server:id', {
                id: poste.poste_id
            });
        });
    }

    data.postes.forEach(register)


})




async function initMap() {

    // Coordenadas de Inicialización del Mapa
    var uluru = {lat: 4.6358797607450555, lng: -74.08272319690876};

    // Inicialización del Mapa
    map = await new google.maps.Map(
        document.getElementById('map'), {
            zoom: 15,      // Zoom que va a tener el mapa
            center: uluru, // Coordenadas donde va a iniciar el mapa
            style: 'mapbox://styles/mapbox/streets-v11',
        }
    );
    
    // Le envia una señal al servidor, indicandole que el mapa
    // ya esta activo en el Cliente (Navegador)
    await socket.emit('server:postes', {
        flag: true
    });
}

// Pone el mapa en la etiqueta
// <div id="map"> </div>
google.maps.event.addDomListener(window, 'load', initMap);