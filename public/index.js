const socket = io();
var map = undefined;
console.log(socket)

var markerImg = {
    lamppost : 'https://i.ibb.co/LgztTNk/lamppost.png'
}

function contentString(id, lat, lng, potenciaI, potenciaA) {
    var content = '<div id="content">'+
    '<div id="siteNotice">'+
        '</div>'+
            `<h1 id="firstHeading" class="firstHeading">Poste ${id}</h1>`+
            '<div id="bodyContent">'+
            '<ul>'+
                `<li>Latitud: ${lat}</li>`+
                `<li>Longitud: ${lng}</li>`+
                `<li id="potencia-i-${id}">P Instantanea: ${potenciaI}</li>`+
                `<li id="potencia-a-${id}">P Acumulada: ${potenciaA}</li>`+
            '</ul>'+
        '</div>'+
    '</div>';

    return content
}
var markets = []

socket.on('arduino:data', function (data) {
    var potenciaI = document.getElementById('potencia-i-'+data.id);
    var potenciaA = document.getElementById('potencia-a-'+data.id);
    potenciaI.innerHTML = 'P Instantanea: ' + data.value;
    potenciaA.innerHTML = 'P Acumulada: ' + data.value;
})


socket.on('client:postes', function (data) {

    console.log(data)

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

    var uluru = {lat: 4.6358797607450555, lng: -74.08272319690876};

    map = await new google.maps.Map(
        document.getElementById('map'), {
            zoom: 15,
            center: uluru,
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
        }
    );

    await socket.emit('server:postes', {
        flag: true
    });

    /*var content = contentString(1, uluru.lat, uluru.lng, 0, 0);

    var infowindow = new google.maps.InfoWindow({
        content: content,
        maxWidth: 270
    });

    var marker = new google.maps.Marker({
        position: uluru,
        map: map,
        icon: markerImg.lamppost
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });*/
}

google.maps.event.addDomListener(window, 'load', initMap);